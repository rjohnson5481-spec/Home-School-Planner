import { useState } from 'react';

// Reads a File as a base64 data string (strips the data: prefix).
function readAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function timestamp() {
  const d = new Date();
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  return `[${h}:${m}:${s}]`;
}

// Manages PDF import state, the fetch call to /api/parse-schedule, and an
// import debug log. Never calls the Anthropic API directly.
export function usePdfImport() {
  const [file, setFile]           = useState(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult]       = useState(null);
  const [error, setError]         = useState('');
  const [log, setLog]             = useState([]);

  function addLog(message) {
    setLog(prev => [...prev, `${timestamp()} ${message}`]);
  }

  function selectFile(selectedFile) {
    setFile(selectedFile);
    setResult(null);
    setError('');
    setLog([]);
    addLog(`File selected: ${selectedFile.name} (${selectedFile.type})`);
  }

  async function importSchedule() {
    if (!file) return;
    setImporting(true);
    setError('');
    addLog(`Sending request to /api/parse-schedule`);
    try {
      const base64 = await readAsBase64(file);
      const res = await fetch('/api/parse-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: base64, mediaType: file.type }),
      });
      addLog(`Response: ${res.status} ${res.statusText}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
      const totalLessons = (data.days ?? []).reduce((n, d) => n + (d.lessons?.length ?? 0), 0);
      addLog(`Parsed: ${data.student}, week ${data.weekId}, ${data.days?.length ?? 0} days, ${totalLessons} lessons`);
      setResult(data);
    } catch (err) {
      addLog(`Error: ${err.message}`);
      setError(err.message);
    } finally {
      setImporting(false);
    }
  }

  function reset() {
    setFile(null);
    setImporting(false);
    setResult(null);
    setError('');
    setLog([]);
  }

  return { file, importing, result, error, log, selectFile, importSchedule, addLog, reset };
}
