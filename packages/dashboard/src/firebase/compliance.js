// Firestore reads, writes, and subscriptions for the School Days Compliance
// feature. No business logic — pure I/O only. All paths from
// constants/compliance.js.

import {
  collection, doc, onSnapshot, setDoc, query, where, documentId,
} from 'firebase/firestore';
import { db } from '@homeschool/shared';
import {
  compliancePath, schoolDayDocPath, schoolDaysPath, COMPLIANCE_DEFAULTS,
} from '../constants/compliance.js';

// Subscribes to the user's compliance settings doc.
// cb receives a populated settings object — falls back to COMPLIANCE_DEFAULTS
// when the doc does not exist yet so consumers always get every field.
// Returns the onSnapshot unsubscribe function.
export function subscribeCompliance(uid, cb) {
  return onSnapshot(doc(db, compliancePath(uid)), snap => {
    cb(snap.exists() ? { ...COMPLIANCE_DEFAULTS, ...snap.data() } : { ...COMPLIANCE_DEFAULTS });
  });
}

// Writes the full compliance settings doc with merge: true so concurrent
// writes from different fields don't clobber each other. No validation —
// the UI is responsible for coercing types.
export function saveCompliance(uid, settings) {
  return setDoc(doc(db, compliancePath(uid)), settings, { merge: true });
}

// Writes hoursLogged for a single calendar date. merge: true preserves any
// other future fields on the same doc.
export function saveSchoolDayHours(uid, dateString, hours) {
  return setDoc(doc(db, schoolDayDocPath(uid, dateString)), { hoursLogged: hours }, { merge: true });
}

// Subscribes to the schoolDays collection filtered to docs whose ID falls
// within [startDate, endDate] inclusive. Filters by document ID using
// documentId() since dateString IDs sort lexicographically as YYYY-MM-DD.
// cb receives an array of { _id, ...data } objects. Returns the unsubscribe.
export function subscribeSchoolDays(uid, startDate, endDate, cb) {
  const q = query(
    collection(db, schoolDaysPath(uid)),
    where(documentId(), '>=', startDate),
    where(documentId(), '<=', endDate),
  );
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ _id: d.id, ...d.data() })));
  });
}
