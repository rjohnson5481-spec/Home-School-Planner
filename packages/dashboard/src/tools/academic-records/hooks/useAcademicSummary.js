import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@homeschool/shared';
import { getGrades as fbGetGrades } from '../firebase/academicRecords.js';

// Computes the summary tree the Records main view renders:
//   activeSchoolYear, activeQuarterId, studentEnrollments, courseCount,
//   attendanceDays { attended, sick, total, required }, grades.
//
// School-year and quarter selection are pure functions of the props
// (recomputed via useMemo). Grades + sick days come from Firestore reads
// fired once per uid change. The hook does NOT subscribe — call sites
// reload by remounting (e.g. tab switch).
//
// All YYYY-MM-DD strings are parsed as LOCAL dates (avoids the UTC
// midnight gotcha that bit the planner — see CLAUDE.md mondayWeekId note).

const REQUIRED_DAYS = 175;

function parseLocalDate(s) {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function todayIsoDate() {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
}

// Inclusive count of Mon–Fri days between two YYYY-MM-DD strings.
function countSchoolDays(startStr, endStr) {
  const start = parseLocalDate(startStr);
  const end   = parseLocalDate(endStr);
  if (!start || !end || start > end) return 0;
  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const day = cur.getDay();
    if (day >= 1 && day <= 5) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

export function useAcademicSummary(uid, student, schoolYears, enrollments, courses) {
  const [grades, setGrades]       = useState([]);
  const [sickDates, setSickDates] = useState([]); // array of YYYY-MM-DD doc ids
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  // ── Pure computations from props ────────────────────────────────────────

  // Year that spans today, else the most recently created (last) year.
  const activeSchoolYear = useMemo(() => {
    const years = schoolYears ?? [];
    if (years.length === 0) return null;
    const today = todayIsoDate();
    const inRange = years.find(y =>
      y.startDate && y.endDate && y.startDate <= today && today <= y.endDate
    );
    return inRange ?? years[years.length - 1];
  }, [schoolYears]);

  // Quarter spanning today, else the first quarter of the active year.
  const activeQuarterId = useMemo(() => {
    const qs = activeSchoolYear?.quarters ?? [];
    if (qs.length === 0) return null;
    const today = todayIsoDate();
    const cur = qs.find(q =>
      q.startDate && q.endDate && q.startDate <= today && today <= q.endDate
    );
    return (cur ?? qs[0]).id;
  }, [activeSchoolYear]);

  const studentEnrollments = useMemo(
    () => (enrollments ?? []).filter(e => e.student === student),
    [enrollments, student],
  );
  const courseCount = studentEnrollments.length;

  // Surface `courses` as a stable touchpoint so future per-course math
  // can recompute without prop-shape changes.
  void courses; // currently unused at hook level; consumed downstream

  // ── Firestore reads (grades + sick days) ───────────────────────────────

  useEffect(() => {
    if (!uid) {
      setGrades([]); setSickDates([]); setLoading(false); return;
    }
    setLoading(true); setError(null);
    Promise.all([
      fbGetGrades(uid),
      getDocs(collection(db, `users/${uid}/sickDays`)),
    ])
      .then(([gradesArr, sickSnap]) => {
        setGrades(gradesArr);
        setSickDates(sickSnap.docs.map(d => d.id));
      })
      .catch(err => setError(err?.message ?? 'Failed to load summary'))
      .finally(() => setLoading(false));
  }, [uid]);

  // ── Attendance derived from year + sick days + breaks ───────────────────
  // schoolDays = weekdays from year start through today (or endDate if past).
  // breakDays  = weekdays within any break period up to the same cutoff.
  // attended   = schoolDays − breakDays − sick.
  const attendanceDays = useMemo(() => {
    const start = activeSchoolYear?.startDate;
    if (!start) return { attended: 0, sick: 0, breakDays: 0, schoolDays: 0, required: REQUIRED_DAYS };
    const today = todayIsoDate();
    const end = (activeSchoolYear?.endDate && today > activeSchoolYear.endDate)
      ? activeSchoolYear.endDate
      : today;
    const schoolDays = countSchoolDays(start, end);
    const sick = sickDates.filter(d => d >= start && d <= end).length;
    // Count weekdays within each break that overlap the start–end window.
    let breakDays = 0;
    for (const b of (activeSchoolYear?.breaks ?? [])) {
      if (!b.startDate || !b.endDate) continue;
      const bStart = b.startDate < start ? start : b.startDate;
      const bEnd = b.endDate > end ? end : b.endDate;
      if (bStart <= bEnd) breakDays += countSchoolDays(bStart, bEnd);
    }
    const attended = Math.max(0, schoolDays - breakDays - sick);
    return { attended, sick, breakDays, schoolDays, required: REQUIRED_DAYS };
  }, [activeSchoolYear, sickDates]);

  return {
    activeSchoolYear,
    activeQuarterId,
    studentEnrollments,
    courseCount,
    attendanceDays,
    grades,
    loading,
    error,
  };
}
