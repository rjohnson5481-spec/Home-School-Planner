import { useState } from 'react';
import './SickDaySheet.css';

// Props:
//   subjects   — string[] — subjects on the current day
//   dayData    — { [subject]: { lesson, note, done, flag } }
//   dayName    — string — e.g. "Monday"
//   onConfirm(selectedSubjects) — called with array of subjects to shift
//   onClose
export default function SickDaySheet({ subjects, dayData, dayName, onConfirm, onClose }) {
  const [selected, setSelected] = useState(new Set(subjects));

  function toggle(subject) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(subject)) next.delete(subject); else next.add(subject);
      return next;
    });
  }

  return (
    <div className="sick-day-overlay" onClick={onClose}>
      <div className="sick-day-sheet" onClick={e => e.stopPropagation()}>
        <div className="sick-day-handle" />

        <div className="sick-day-header">
          <span className="sick-day-title">Sick Day — {dayName}</span>
          <button className="sick-day-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <p className="sick-day-prompt">
          Select subjects to shift to the next school day:
        </p>

        <div className="sick-day-list">
          {subjects.map(subject => {
            const checked = selected.has(subject);
            const lesson  = dayData[subject]?.lesson;
            return (
              <button
                key={subject}
                className={`sick-day-item${checked ? ' sick-day-item--checked' : ''}`}
                onClick={() => toggle(subject)}
              >
                <span className="sick-day-check">{checked ? '✓' : ''}</span>
                <span className="sick-day-subject">{subject}</span>
                {lesson && <span className="sick-day-lesson">{lesson}</span>}
              </button>
            );
          })}
        </div>

        <div className="sick-day-footer">
          <button className="sick-day-cancel" onClick={onClose}>Cancel</button>
          <button
            className="sick-day-confirm"
            onClick={() => onConfirm([...selected])}
            disabled={selected.size === 0}
          >
            Shift {selected.size} subject{selected.size !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
