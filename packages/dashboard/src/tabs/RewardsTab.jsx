import { useState, useEffect } from 'react';
import { useAuth }        from '@homeschool/shared';
import { db }             from '@homeschool/shared';
import { doc, onSnapshot } from 'firebase/firestore';
import { seedIfNeeded }   from '../tools/reward-tracker/firebase/rewardTracker.js';
import RewardLayout       from '../tools/reward-tracker/components/RewardLayout.jsx';

export default function RewardsTab() {
  const { user } = useAuth();
  const uid = user?.uid;
  const [students, setStudents] = useState([]);
  const [seeded, setSeeded]     = useState(false);

  useEffect(() => {
    if (!uid) return;
    return onSnapshot(doc(db, `users/${uid}/settings/students`), snap => {
      setStudents(snap.data()?.names ?? []);
    });
  }, [uid]);

  useEffect(() => {
    if (!uid || !students.length) return;
    seedIfNeeded(uid, students).then(() => setSeeded(true)).catch(() => setSeeded(true));
  }, [uid, students]);

  if (!user || !seeded) return null;

  return <RewardLayout uid={uid} students={students} />;
}
