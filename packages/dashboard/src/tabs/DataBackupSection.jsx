import { useState, useRef } from 'react';
import { downloadBackup, importMerge, importFullRestore } from '../firebase/backup.js';
import './DataBackupSection.css';

export default function DataBackupSection({ uid }) {
  const [exporting, setExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const [mergeResult, setMergeResult] = useState(null);
  const [restoreStep, setRestoreStep] = useState(0);
  const [restoreInput, setRestoreInput] = useState('');
  const [restoreResult, setRestoreResult] = useState(null);
  const [busy, setBusy]   = useState(false);
  const mergeRef = useRef(null);
  const restoreRef = useRef(null);

  async function handleExport() {
    setExporting(true);
    try { await downloadBackup(uid); setExportDone(true); setTimeout(() => setExportDone(false), 2000); }
    catch (err) { console.warn('Export failed', err); }
    finally { setExporting(false); }
  }

  async function handleMergeFile(e) {
    const file = e.target.files?.[0]; if (!file) return;
    setBusy(true); setMergeResult(null);
    try {
      const text = await file.text();
      const backup = JSON.parse(text);
      const result = await importMerge(uid, backup);
      setMergeResult(`Imported ${result.imported} items, skipped ${result.skipped} already existing.`);
    } catch (err) { setMergeResult(`Error: ${err.message}`); }
    finally { setBusy(false); if (mergeRef.current) mergeRef.current.value = ''; }
  }

  function startRestore() { setRestoreStep(1); setRestoreInput(''); setRestoreResult(null); }

  async function handleRestoreFile(e) {
    const file = e.target.files?.[0]; if (!file) return;
    setBusy(true); setRestoreStep(0);
    try {
      const text = await file.text();
      const backup = JSON.parse(text);
      const result = await importFullRestore(uid, backup);
      setRestoreResult(`Restored ${result.restored} items. Reload the app to see your data.`);
    } catch (err) { setRestoreResult(`Error: ${err.message}`); }
    finally { setBusy(false); if (restoreRef.current) restoreRef.current.value = ''; }
  }

  return (
    <section>
      <p className="st-section-label"><span>Data &amp; Backup</span></p>
      <div className="st-card">
        <div className="st-row">
          <span className="st-row-icon">💾</span>
          <div className="st-row-body">
            <span className="st-row-title">Export Backup</span>
            <span className="st-row-sub">Download all your data as a JSON file</span>
          </div>
          <button className="db-btn db-btn--gold" onClick={handleExport} disabled={exporting || exportDone}>
            {exporting ? 'Exporting...' : exportDone ? 'Done ✓' : 'Export'}
          </button>
        </div>
        <div className="st-row">
          <span className="st-row-icon">📥</span>
          <div className="st-row-body">
            <span className="st-row-title">Import &amp; Merge</span>
            <span className="st-row-sub">Restore missing data — existing data is never overwritten</span>
            {mergeResult && <span className="db-result">{mergeResult}</span>}
          </div>
          <label className="db-btn db-btn--ghost">
            {busy ? 'Importing...' : 'Choose File'}
            <input ref={mergeRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleMergeFile} disabled={busy} />
          </label>
        </div>
        <div className="st-row">
          <span className="st-row-icon">⚠️</span>
          <div className="st-row-body">
            <span className="st-row-title">Full Restore</span>
            <span className="st-row-sub db-danger-sub">Replace ALL current data with a backup file. This cannot be undone.</span>
            {restoreResult && <span className="db-result">{restoreResult}</span>}
            {restoreResult && <button className="db-btn db-btn--gold db-reload" onClick={() => window.location.reload()}>Reload</button>}
          </div>
          <button className="db-btn db-btn--red" onClick={startRestore} disabled={busy}>Restore</button>
        </div>
      </div>

      {restoreStep === 1 && (
        <div className="db-modal-overlay" onClick={() => setRestoreStep(0)}>
          <div className="db-modal" onClick={e => e.stopPropagation()}>
            <h3 className="db-modal-title">⚠️ Full Restore</h3>
            <p className="db-modal-body">This will permanently delete ALL your current data and replace it with the selected backup file. Every lesson, grade, reward, and record will be erased. This cannot be undone.</p>
            <div className="db-modal-actions">
              <button className="db-btn db-btn--ghost" onClick={() => setRestoreStep(0)}>Cancel</button>
              <button className="db-btn db-btn--red" onClick={() => setRestoreStep(2)}>Continue</button>
            </div>
          </div>
        </div>
      )}
      {restoreStep === 2 && (
        <div className="db-modal-overlay" onClick={() => setRestoreStep(0)}>
          <div className="db-modal" onClick={e => e.stopPropagation()}>
            <h3 className="db-modal-title">Confirm Full Restore</h3>
            <p className="db-modal-body">Type <strong>RESTORE</strong> to confirm.</p>
            <input className="db-confirm-input" value={restoreInput} onChange={e => setRestoreInput(e.target.value)}
              placeholder="Type RESTORE to confirm" autoFocus />
            <div className="db-modal-actions">
              <button className="db-btn db-btn--ghost" onClick={() => setRestoreStep(0)}>Cancel</button>
              <label className={`db-btn db-btn--red${restoreInput !== 'RESTORE' ? ' disabled' : ''}`}>
                {busy ? 'Restoring...' : 'Confirm Restore'}
                <input ref={restoreRef} type="file" accept=".json" style={{ display: 'none' }}
                  onChange={handleRestoreFile} disabled={restoreInput !== 'RESTORE' || busy} />
              </label>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
