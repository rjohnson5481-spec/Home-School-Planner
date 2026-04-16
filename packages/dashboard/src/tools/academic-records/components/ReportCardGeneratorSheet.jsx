import { useState, useEffect, useMemo, useRef } from 'react';
import { GRADING_TYPE_LETTER } from '../constants/academics.js';
import './ReportCardGeneratorSheet.css';

const STUDENTS = ['Orion', 'Malachi'];

function todayFormatted() {
  const t = new Date();
  return t.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function ReportCardGeneratorSheet({
  open, onClose, student, activeSchoolYear, selectedQuarterId,
  enrollments, courses, grades, attendanceDays, reportNotes, saveNote,
}) {
  const [localStudent, setLocalStudent]   = useState(student ?? STUDENTS[0]);
  const [localQuarter, setLocalQuarter]   = useState(selectedQuarterId);
  const [includeGrades, setIncludeGrades] = useState(true);
  const [includeAttend, setIncludeAttend] = useState(true);
  const [includeNotes, setIncludeNotes]   = useState(true);
  const [includeSig, setIncludeSig]       = useState(true);
  const [notes, setNotes]                 = useState('');
  const [saved, setSaved]                 = useState(false);
  const savedTimer = useRef(null);

  useEffect(() => {
    if (!open) return;
    setLocalStudent(student ?? STUDENTS[0]);
    setLocalQuarter(selectedQuarterId);
    const existing = (reportNotes ?? []).find(n => n.student === (student ?? STUDENTS[0]) && n.quarterId === selectedQuarterId);
    setNotes(existing?.notes ?? '');
    setSaved(false);
  }, [open, student, selectedQuarterId, reportNotes]);

  useEffect(() => {
    const existing = (reportNotes ?? []).find(n => n.student === localStudent && n.quarterId === localQuarter);
    setNotes(existing?.notes ?? '');
  }, [localStudent, localQuarter, reportNotes]);

  useEffect(() => () => clearTimeout(savedTimer.current), []);

  const courseById = useMemo(() => new Map((courses ?? []).map(c => [c.id, c])), [courses]);
  const studentEnr = useMemo(() => (enrollments ?? []).filter(e => e.student === localStudent), [enrollments, localStudent]);
  const quarters = activeSchoolYear?.quarters ?? [];
  const quarterLabel = quarters.find(q => q.id === localQuarter)?.label ?? 'Quarter';
  const studentGradeLevel = studentEnr[0]?.gradeLevel ?? null;
  const attendPct = attendanceDays.required > 0 ? Math.min(100, Math.round((attendanceDays.attended / attendanceDays.required) * 100)) : 0;

  async function handleNotesBlur() {
    if (!saveNote) return;
    try {
      await saveNote(localStudent, localQuarter, notes);
      setSaved(true);
      clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setSaved(false), 2000);
    } catch { /* error surfaces via hook */ }
  }

  if (!open) return null;

  return (
    <div className="rcg-sheet-overlay" onClick={onClose}>
      <div className="rcg-sheet" onClick={e => e.stopPropagation()}>
        <div className="rcg-sheet-handle" aria-hidden="true" />
        <header className="rcg-sheet-header">
          <h2 className="rcg-sheet-title">Report Card Generator</h2>
          <button className="rcg-sheet-close" onClick={onClose} aria-label="Close">✕</button>
        </header>
        <div className="rcg-sheet-body">

          <div className="rcg-field">
            <span className="rcg-label">Student</span>
            <div className="rcg-pills">{STUDENTS.map(s => (
              <button key={s} className={`rcg-pill${s === localStudent ? ' active' : ''}`} onClick={() => setLocalStudent(s)}>{s}</button>
            ))}</div>
          </div>

          <div className="rcg-field">
            <span className="rcg-label">Report period</span>
            <div className="rcg-pills">{quarters.map(q => (
              <button key={q.id} className={`rcg-pill${q.id === localQuarter ? ' active' : ''}`} onClick={() => setLocalQuarter(q.id)}>{q.label}</button>
            ))}</div>
          </div>

          <div className="rcg-field">
            <span className="rcg-label">Include</span>
            {[['Grades', includeGrades, setIncludeGrades], ['Attendance', includeAttend, setIncludeAttend],
              ['Teacher Notes', includeNotes, setIncludeNotes], ['Signature Line', includeSig, setIncludeSig]].map(([lbl, val, set]) => (
              <div key={lbl} className="rcg-toggle-row">
                <span className="rcg-toggle-label">{lbl}</span>
                <button type="button" className={`rcg-toggle${val ? ' rcg-toggle--on' : ''}`} onClick={() => set(v => !v)} />
              </div>
            ))}
          </div>

          <div className="rcg-field">
            <span className="rcg-label">Teacher notes {saved && <span className="rcg-saved">Saved</span>}</span>
            <textarea className="rcg-notes" rows={3} value={notes} onChange={e => setNotes(e.target.value)}
              onBlur={handleNotesBlur} placeholder="Add notes about this student's performance this quarter..." />
          </div>

          <p className="rcg-section-label">Preview</p>

          <div className="rcg-preview-card">
            <div className="rcg-preview-header">
              <div className="rcg-preview-school">IRON & LIGHT<br />JOHNSON ACADEMY</div>
              <div className="rcg-preview-tagline">Faith · Knowledge · Strength</div>
              <div className="rcg-preview-type">Report Card — {quarterLabel}</div>
            </div>
            <div className="rcg-preview-student">
              <span><strong>{localStudent}</strong>{studentGradeLevel ? ` · Grade ${studentGradeLevel}` : ''}</span>
              <span>{activeSchoolYear?.label ?? '—'} · {todayFormatted()}</span>
            </div>
            {includeGrades && (
              <table className="rcg-preview-grades">
                <thead><tr><th>Course</th><th>Curriculum</th><th>Scale</th><th>Grade</th></tr></thead>
                <tbody>{studentEnr.map(enr => {
                  const c = courseById.get(enr.courseId);
                  const g = (grades ?? []).find(gr => gr.enrollmentId === enr.id && gr.quarterId === localQuarter);
                  const isLetter = (c?.gradingType ?? GRADING_TYPE_LETTER) === GRADING_TYPE_LETTER;
                  return (
                    <tr key={enr.id}>
                      <td>{c?.name ?? '—'}</td><td>{c?.curriculum ?? '—'}</td>
                      <td>{isLetter ? 'Letter' : 'E/S/N/U'}</td>
                      <td className="rcg-grade-cell">{g ? `${g.grade}${g.percent != null ? ` (${g.percent}%)` : ''}` : '—'}</td>
                    </tr>
                  );
                })}</tbody>
              </table>
            )}
            {includeAttend && (
              <div className="rcg-preview-attendance">
                <div className="rcg-att-box"><div className="rcg-att-num">{attendanceDays.schoolDays}</div><div className="rcg-att-lbl">Scheduled</div></div>
                <div className="rcg-att-box"><div className="rcg-att-num">{attendanceDays.sick}</div><div className="rcg-att-lbl">Absent</div></div>
                <div className="rcg-att-box"><div className="rcg-att-num">{attendanceDays.attended}</div><div className="rcg-att-lbl">Present</div></div>
                <div className="rcg-att-box"><div className="rcg-att-num">{attendPct}%</div><div className="rcg-att-lbl">Rate</div></div>
              </div>
            )}
            {includeNotes && notes.trim() && (
              <div className="rcg-preview-notes">{notes}</div>
            )}
            <div className="rcg-preview-footer">
              <span>Iron & Light Johnson Academy</span>
              {includeSig && <span className="rcg-sig-line">Signature _______________</span>}
            </div>
          </div>

          <button className="rcg-generate-btn" disabled title="Coming in 9B">
            Generate PDF (coming soon)
          </button>

        </div>
      </div>
    </div>
  );
}
