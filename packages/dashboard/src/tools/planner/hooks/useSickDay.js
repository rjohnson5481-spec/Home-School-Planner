import { useState, useEffect } from 'react';
import { subscribeSickDays } from '../firebase/planner.js';
import { getWeekDates, toWeekId } from '../constants/days.js';

// Owns the sick-day surface for the planner: a live Firestore subscription
// scoped to the current week + student, plus the confirm/undo handlers that
// were previously inline in PlannerLayout.
//
// hasSickDayThisWeek drives the Undo Sick Day button so it renders whenever
// a sick day exists for this student this week — independent of which day
// the user is currently viewing. A sick day triggered on mobile is therefore
// visible on desktop and vice versa, since both clients read the same
// /users/{uid}/sickDays/{date} markers in real time.
export function useSickDay({
  uid, weekId, student, day,
  performSickDay, performUndoSickDay,
  setDay, setShowSickDay, setShowUndoSickDay,
}) {
  const [sickDays, setSickDays] = useState({});

  useEffect(() => {
    if (!uid) return;
    const dateStrings = getWeekDates(weekId).map(d => toWeekId(d));
    return subscribeSickDays(uid, dateStrings, setSickDays);
  }, [uid, weekId]);

  const sickDayIndices = new Set(
    getWeekDates(weekId).reduce((acc, date, i) => {
      if (sickDays[toWeekId(date)]?.student === student) acc.push(i);
      return acc;
    }, [])
  );
  const hasSickDayThisWeek = sickDayIndices.size > 0;
  const isSickDay = sickDayIndices.has(day);

  // Defensive reset on week/student switch — Full Restore can swap the
  // underlying Firestore state out from under an open sheet.
  useEffect(() => {
    setShowSickDay(false);
    setShowUndoSickDay(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekId, student]);

  async function handleSickDayConfirm(selectedSubjects, sickDayIndex) {
    await performSickDay(selectedSubjects, sickDayIndex);
    setShowSickDay(false);
    // Jump to the sick column so the per-day banner + shifted lessons are
    // visible immediately. The Undo button no longer depends on this — it
    // reads hasSickDayThisWeek, not sickDayIndices.has(day).
    setDay(sickDayIndex);
  }

  async function handleUndoSickDay() {
    await performUndoSickDay();
    setShowUndoSickDay(false);
  }

  return {
    sickDayIndices, hasSickDayThisWeek, isSickDay,
    handleSickDayConfirm, handleUndoSickDay,
  };
}
