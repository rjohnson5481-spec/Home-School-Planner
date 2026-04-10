import { useState, useEffect } from 'react';
import {
  subscribeSubjectList,
  saveSubjectList,
  subscribeDayData,
  updateCell as dbUpdateCell,
} from '../firebase/planner.js';

// Manages subject list + week day data for one student.
// weekData shape: { [subject]: { [dayIndex: 0-4]: { lesson, note, done, flag } } }
export function useSubjects(uid, weekId, student) {
  const [subjects, setSubjects] = useState([]);
  const [weekData, setWeekData] = useState({});
  const [loading, setLoading]   = useState(true);

  // Subscribe to the student's subject list.
  useEffect(() => {
    if (!uid) return;
    setLoading(true);
    const unsub = subscribeSubjectList(uid, student, list => {
      setSubjects(list);
      setLoading(false);
    });
    return () => { unsub(); setSubjects([]); setLoading(true); };
  }, [uid, student]);

  // When subjects or week changes, rebuild all day-data subscriptions.
  // Each snapshot fires independently and merges into weekData.
  useEffect(() => {
    if (!uid || !subjects.length) { setWeekData({}); return; }
    const unsubs = subjects.map(subject =>
      subscribeDayData(uid, weekId, student, subject, days =>
        setWeekData(prev => ({ ...prev, [subject]: days }))
      )
    );
    return () => { unsubs.forEach(fn => fn()); setWeekData({}); };
  }, [uid, weekId, student, subjects]);

  // Appends to the subject list only. Never creates cell documents.
  // Cell documents are created exclusively when a cell is explicitly saved (updateCell).
  function addSubject(subject) {
    return saveSubjectList(uid, student, [...subjects, subject]);
  }

  function removeSubject(subject) {
    return saveSubjectList(uid, student, subjects.filter(s => s !== subject));
  }

  // Trims text fields before writing so whitespace-only values from schedule
  // imports never create phantom cell documents in Firestore.
  function updateCell(subject, dayIndex, data) {
    const cleaned = {
      ...data,
      lesson: (data.lesson ?? '').trim(),
      note:   (data.note   ?? '').trim(),
    };
    return dbUpdateCell(uid, weekId, student, subject, dayIndex, cleaned);
  }

  return { subjects, weekData, loading, updateCell, addSubject, removeSubject };
}
