import { useState } from 'react';
import { useDarkMode }  from '../hooks/useDarkMode.js';
import { useSettings }  from '../hooks/useSettings.js';
import { version }      from '../../package.json';
import './SettingsSheet.css';

// Props: uid (string), onClose
export default function SettingsSheet({ uid, onClose }) {
  const { mode, toggle }                                        = useDarkMode();
  const { students, activeStudent, setActiveStudent,
          activeSubjects, saveStudents, saveSubjects }          = useSettings(uid);
  const [editingIdx, setEditingIdx]     = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [addingSubject, setAddingSubject] = useState(false);
  const [newSubject, setNewSubject]     = useState('');
  const [clearing, setClearing]         = useState(false);

  function startEdit(i, name) { setEditingIdx(i); setEditingValue(name); }

  function commitEdit(i) {
    const trimmed = editingValue.trim();
    // Replace with new name, or remove row if left empty.
    const updated = trimmed
      ? students.map((n, j) => j === i ? trimmed : n)
      : students.filter((_, j) => j !== i);
    saveStudents(updated);
    setEditingIdx(null);
  }

  function addStudent() {
    // Append an empty placeholder; commitEdit will fill or remove it.
    saveStudents([...students, '']);
    setEditingIdx(students.length); // length before update = index of new entry
    setEditingValue('');
  }

  function removeSubject(subj) {
    saveSubjects(activeSubjects.filter(s => s !== subj));
  }

  function commitNewSubject() {
    if (newSubject.trim()) saveSubjects([...activeSubjects, newSubject.trim()]);
    setNewSubject('');
    setAddingSubject(false);
  }

  function clearCache() {
    setClearing(true);
    if ('caches' in window) {
      caches.keys()
        .then(keys => Promise.all(keys.map(k => caches.delete(k))))
        .then(() => window.location.reload());
    } else {
      window.location.reload();
    }
  }

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-sheet" onClick={e => e.stopPropagation()}>
        <div className="settings-handle" />
        <header className="settings-header">
          <span className="settings-title">Settings</span>
          <button className="settings-close" onClick={onClose} aria-label="Close">✕</button>
        </header>

        <div className="settings-body">

          <div className="settings-section-label">Appearance</div>
          <div className="settings-row">
            <span className="settings-row-label">Dark Mode</span>
            <button
              className={`settings-toggle${mode === 'dark' ? ' settings-toggle--on' : ''}`}
              onClick={toggle}
              aria-label="Toggle dark mode"
            />
          </div>

          <div className="settings-section-label">Students</div>
          {students.map((name, i) => (
            <div key={i} className="settings-row">
              {editingIdx === i ? (
                <input
                  className="settings-input settings-input--inline"
                  value={editingValue}
                  autoFocus
                  onChange={e => setEditingValue(e.target.value)}
                  onBlur={() => commitEdit(i)}
                  onKeyDown={e => e.key === 'Enter' && commitEdit(i)}
                />
              ) : (
                <>
                  <span className="settings-row-label">{name}</span>
                  <button className="settings-row-action" onClick={() => startEdit(i, name)} aria-label="Edit name">✏</button>
                </>
              )}
            </div>
          ))}
          <button className="settings-add-btn" onClick={addStudent}>+ Add Student</button>

          <div className="settings-section-label">Default Subjects</div>
          <div className="settings-tabs">
            {students.filter(Boolean).map(name => (
              <button
                key={name}
                className={`settings-tab${activeStudent === name ? ' settings-tab--active' : ''}`}
                onClick={() => setActiveStudent(name)}
              >{name}</button>
            ))}
          </div>
          {activeSubjects.map(subj => (
            <div key={subj} className="settings-row">
              <span className="settings-row-label">{subj}</span>
              <button className="settings-row-action settings-row-action--remove" onClick={() => removeSubject(subj)} aria-label="Remove">✕</button>
            </div>
          ))}
          {addingSubject ? (
            <input
              className="settings-input"
              value={newSubject}
              autoFocus
              placeholder="Subject name…"
              onChange={e => setNewSubject(e.target.value)}
              onBlur={commitNewSubject}
              onKeyDown={e => e.key === 'Enter' && commitNewSubject()}
            />
          ) : (
            <button className="settings-add-btn" onClick={() => setAddingSubject(true)}>+ Add Subject</button>
          )}

          <div className="settings-coming-soon">
            <div className="settings-section-label">
              School Year <span className="settings-badge">Coming Soon</span>
            </div>
            <p className="settings-coming-desc">Set your academic year start and end dates — coming in Phase 2</p>
          </div>

          <div className="settings-section-label">App</div>
          <div className="settings-row">
            <span className="settings-row-label">Version</span>
            <span className="settings-row-value">v{version}</span>
          </div>
          <button className="settings-cache-btn" onClick={clearCache} disabled={clearing}>
            {clearing ? 'Clearing…' : 'Clear Cache & Reload'}
          </button>

          <div className="settings-coming-soon">
            <div className="settings-section-label">
              School Days <span className="settings-badge">Coming Soon</span>
            </div>
            <p className="settings-coming-desc">Track school days completed for ND compliance — coming in Phase 2</p>
          </div>

        </div>
      </div>
    </div>
  );
}
