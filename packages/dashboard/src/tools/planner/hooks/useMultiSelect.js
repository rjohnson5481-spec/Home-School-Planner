import { useState, useEffect, useCallback } from 'react';
import { readCell, updateCell, deleteCell } from '../firebase/planner.js';

const ALL_DAY_KEY = 'allday';
const DELETE_CONFIRM_TIMEOUT_MS = 3000;

// Mobile multi-select state + actions for a single day's subjects.
// `subjects` is the list of subject keys present on the current day —
// selectAll filters 'allday' out of the resulting Set, and the entry-point
// helpers (enterSelectMode, toggleSelect) ignore 'allday' too.
//
// Actions read fresh cell data from Firestore so an out-of-date local cache
// can't ship a stale `done` flag back over the wire.
export function useMultiSelect({ uid, weekId, student, day, subjects }) {
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(() => new Set());
  const [deleteConfirmPending, setDeleteConfirmPending] = useState(false);

  // Reset everything when the active day/student/week changes — a stale
  // selection set from another day would write to the wrong cells.
  useEffect(() => {
    setIsSelectMode(false);
    setSelectedKeys(new Set());
    setDeleteConfirmPending(false);
  }, [weekId, student, day]);

  // Auto-clear delete-confirm pending after 3 seconds of inactivity.
  useEffect(() => {
    if (!deleteConfirmPending) return;
    const t = setTimeout(() => setDeleteConfirmPending(false), DELETE_CONFIRM_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [deleteConfirmPending]);

  const enterSelectMode = useCallback((subjectKey) => {
    if (subjectKey === ALL_DAY_KEY) return;
    setIsSelectMode(true);
    setSelectedKeys(new Set([subjectKey]));
    setDeleteConfirmPending(false);
  }, []);

  const toggleSelect = useCallback((subjectKey) => {
    if (subjectKey === ALL_DAY_KEY) return;
    setDeleteConfirmPending(false);
    setSelectedKeys(prev => {
      const next = new Set(prev);
      if (next.has(subjectKey)) next.delete(subjectKey);
      else next.add(subjectKey);
      if (next.size === 0) setIsSelectMode(false);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setDeleteConfirmPending(false);
    setSelectedKeys(new Set((subjects ?? []).filter(s => s !== ALL_DAY_KEY)));
  }, [subjects]);

  const exitSelectMode = useCallback(() => {
    setSelectedKeys(new Set());
    setIsSelectMode(false);
    setDeleteConfirmPending(false);
  }, []);

  async function handleMarkDone() {
    if (!uid || selectedKeys.size === 0) return;
    const keys = [...selectedKeys];
    const cells = await Promise.all(keys.map(s => readCell(uid, weekId, student, day, s)));
    const allDone = cells.every(c => c?.done);
    const nextDone = !allDone;
    await Promise.all(keys.map(s =>
      updateCell(uid, weekId, student, s, day, { done: nextDone })
    ));
    exitSelectMode();
  }

  async function handleMoveToDay(targetDayIndex) {
    if (!uid || selectedKeys.size === 0 || targetDayIndex === day) return;
    const keys = [...selectedKeys];
    await Promise.all(keys.map(async s => {
      const cell = await readCell(uid, weekId, student, day, s);
      if (!cell) return;
      await updateCell(uid, weekId, student, s, targetDayIndex, cell);
      await deleteCell(uid, weekId, student, day, s);
    }));
    exitSelectMode();
  }

  async function handleDelete() {
    if (!uid || selectedKeys.size === 0) return;
    if (!deleteConfirmPending) {
      setDeleteConfirmPending(true);
      return;
    }
    const keys = [...selectedKeys];
    await Promise.all(keys.map(s => deleteCell(uid, weekId, student, day, s)));
    exitSelectMode();
  }

  return {
    isSelectMode, selectedKeys, selectedCount: selectedKeys.size,
    deleteConfirmPending,
    enterSelectMode, toggleSelect, selectAll, exitSelectMode,
    handleMarkDone, handleMoveToDay, handleDelete,
  };
}
