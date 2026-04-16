import { useState, useEffect, useCallback } from 'react';
import {
  getSavedReports as fbGetSavedReports,
  saveSavedReport as fbSaveSavedReport,
  deleteSavedReport as fbDeleteSavedReport,
} from '../firebase/academicRecords.js';

export function useSavedReports(uid) {
  const [savedReports, setSavedReports] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  const reload = useCallback(async () => {
    if (!uid) { setSavedReports([]); setLoading(false); return; }
    setLoading(true); setError(null);
    try { setSavedReports(await fbGetSavedReports(uid)); }
    catch (err) { setError(err?.message ?? 'Failed to load saved reports'); }
    finally { setLoading(false); }
  }, [uid]);

  useEffect(() => { reload(); }, [reload]);

  const saveReport = useCallback(async (data) => {
    if (!uid) throw new Error('useSavedReports: uid is required');
    try {
      const id = await fbSaveSavedReport(uid, data);
      await reload();
      return id;
    } catch (err) { setError(err?.message ?? 'Failed to save report'); throw err; }
  }, [uid, reload]);

  const removeReport = useCallback(async (reportId) => {
    if (!uid) throw new Error('useSavedReports: uid is required');
    try { await fbDeleteSavedReport(uid, reportId); await reload(); }
    catch (err) { setError(err?.message ?? 'Failed to delete report'); throw err; }
  }, [uid, reload]);

  return { savedReports, loading, error, saveReport, removeReport };
}
