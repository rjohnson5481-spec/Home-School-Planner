import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@homeschool/shared';
import { useCourses }         from '../tools/academic-records/hooks/useCourses.js';
import { useEnrollments }     from '../tools/academic-records/hooks/useEnrollments.js';
import { useSchoolYears }     from '../tools/academic-records/hooks/useSchoolYears.js';
import { useAcademicSummary } from '../tools/academic-records/hooks/useAcademicSummary.js';
import { GRADING_TYPE_LETTER } from '../tools/academic-records/constants/academics.js';
import CourseCatalogSheet     from '../tools/academic-records/components/CourseCatalogSheet.jsx';
import AddEditCourseSheet     from '../tools/academic-records/components/AddEditCourseSheet.jsx';
import EnrollmentSheet        from '../tools/academic-records/components/EnrollmentSheet.jsx';
import AddEditEnrollmentSheet from '../tools/academic-records/components/AddEditEnrollmentSheet.jsx';
import SchoolYearSheet        from '../tools/academic-records/components/SchoolYearSheet.jsx';
import AddEditSchoolYearSheet from '../tools/academic-records/components/AddEditSchoolYearSheet.jsx';
import './AcademicRecordsTab.css';

// Phase 2 entry point. Three sheet flows + the main Records view (this file).
//   Sheets: Course Catalog, Enrollments, School Year & Quarters
//           (z-index 300 list / 310 editor; only one list open at a time)
//   Main view: student selector, quarter pills, stats, grade list,
//              attendance card, quick actions.

const STUDENTS = ['Orion', 'Malachi'];
const DOT_COLORS = [
  '#1565c0', '#c0392b', '#2e7d32', '#7b1fa2',
  '#e65100', '#00838f', '#558b2f', '#ad1457',
];

// Returns the .ar-grade-value modifier class for a given grade letter.
function gradeClass(grade, gradingType) {
  if (!grade) return '';
  const letter = String(grade).trim().toUpperCase();
  const prefix = gradingType === GRADING_TYPE_LETTER ? 'letter' : 'esnu';
  return `${prefix}-${letter.toLowerCase()}`;
}

function todayStr() {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
}

export default function AcademicRecordsTab() {
  const { user } = useAuth();
  const uid = user?.uid;

  // Data hooks (catalog → enrollments → school years → derived summary)
  const { courses, loading, error, addCourse, updateCourse, removeCourse } = useCourses(uid);
  const {
    enrollments, loading: enrollmentsLoading, error: enrollmentsError,
    addEnrollment, updateEnrollment, removeEnrollment,
  } = useEnrollments(uid, courses);
  const {
    schoolYears, loading: schoolYearsLoading, error: schoolYearsError,
    addSchoolYear, updateSchoolYear, removeSchoolYear,
    addQuarter, updateQuarter, removeQuarter,
  } = useSchoolYears(uid);

  // Main view state
  const [selectedStudent, setSelectedStudent] = useState('Orion');
  const [selectedQuarterId, setSelectedQuarterId] = useState(null);

  const summary = useAcademicSummary(uid, selectedStudent, schoolYears, enrollments, courses);
  const { activeSchoolYear, activeQuarterId, studentEnrollments, courseCount, attendanceDays, grades } = summary;

  // Sync selectedQuarterId once activeQuarterId resolves (or when the active year changes).
  useEffect(() => {
    if (activeQuarterId && selectedQuarterId == null) setSelectedQuarterId(activeQuarterId);
  }, [activeQuarterId, selectedQuarterId]);

  // Sheet state — course catalog
  const [catalogSheetOpen, setCatalogSheetOpen] = useState(false);
  const [addEditSheetOpen, setAddEditSheetOpen] = useState(false);
  const [editingCourse, setEditingCourse]       = useState(null);

  // Sheet state — enrollments
  const [enrollmentSheetOpen, setEnrollmentSheetOpen]               = useState(false);
  const [addEditEnrollmentSheetOpen, setAddEditEnrollmentSheetOpen] = useState(false);
  const [editingEnrollment, setEditingEnrollment]                   = useState(null);
  const [enrollingStudent, setEnrollingStudent]                     = useState(null);

  // Sheet state — school years
  const [schoolYearSheetOpen, setSchoolYearSheetOpen]               = useState(false);
  const [addEditSchoolYearSheetOpen, setAddEditSchoolYearSheetOpen] = useState(false);
  const [schoolYearSheetMode, setSchoolYearSheetMode]               = useState('schoolYear');
  const [editingSchoolYear, setEditingSchoolYear]                   = useState(null);
  const [editingQuarter, setEditingQuarter]                         = useState(null);
  const [activeYearId, setActiveYearId]                             = useState(null);

  // ─── Course handlers ───
  function closeCatalog()       { setCatalogSheetOpen(false); setAddEditSheetOpen(false); setEditingCourse(null); }
  function handleEditCourse(c)  { setEditingCourse(c); setAddEditSheetOpen(true); }
  function handleAddCourse()    { setEditingCourse(null); setAddEditSheetOpen(true); }
  function closeAddEdit()       { setAddEditSheetOpen(false); setEditingCourse(null); }
  async function handleSaveCourse(data) {
    if (!uid) { console.warn('AcademicRecordsTab: uid missing on save — course will not persist'); return; }
    if (editingCourse) await updateCourse(editingCourse.id, data); else await addCourse(data);
    closeAddEdit();
  }
  async function handleDeleteCourse() {
    if (!editingCourse) return;
    await removeCourse(editingCourse.id); closeAddEdit();
  }

  // ─── Enrollment handlers ───
  function closeEnrollments()           { setEnrollmentSheetOpen(false); setAddEditEnrollmentSheetOpen(false); setEditingEnrollment(null); setEnrollingStudent(null); }
  function handleEditEnrollment(e)      { setEditingEnrollment(e); setEnrollingStudent(e.student); setAddEditEnrollmentSheetOpen(true); }
  function handleAddEnrollment(student) { setEnrollingStudent(student); setEditingEnrollment(null); setAddEditEnrollmentSheetOpen(true); }
  function closeAddEditEnrollment()     { setAddEditEnrollmentSheetOpen(false); setEditingEnrollment(null); setEnrollingStudent(null); }
  async function handleSaveEnrollment(data) {
    if (!uid) { console.warn('AcademicRecordsTab: uid missing on save — enrollment will not persist'); return; }
    if (editingEnrollment) await updateEnrollment(editingEnrollment.id, data); else await addEnrollment(data);
    closeAddEditEnrollment();
  }
  async function handleDeleteEnrollment() {
    if (!editingEnrollment) return;
    await removeEnrollment(editingEnrollment.id); closeAddEditEnrollment();
  }

  // ─── School Year + Quarter handlers ───
  function closeSchoolYearSheets() {
    setSchoolYearSheetOpen(false); setAddEditSchoolYearSheetOpen(false);
    setEditingSchoolYear(null); setEditingQuarter(null); setActiveYearId(null);
  }
  function closeAddEditSchoolYear() {
    setAddEditSchoolYearSheetOpen(false);
    setEditingSchoolYear(null); setEditingQuarter(null); setActiveYearId(null);
  }
  function handleAddSchoolYear()   { setEditingSchoolYear(null); setSchoolYearSheetMode('schoolYear'); setAddEditSchoolYearSheetOpen(true); }
  function handleEditSchoolYear(y) { setEditingSchoolYear(y);    setSchoolYearSheetMode('schoolYear'); setAddEditSchoolYearSheetOpen(true); }
  function handleAddQuarter(yearId) {
    setActiveYearId(yearId); setEditingQuarter(null);
    setSchoolYearSheetMode('quarter'); setAddEditSchoolYearSheetOpen(true);
  }
  function handleEditQuarter({ quarter, yearId }) {
    setActiveYearId(yearId); setEditingQuarter({ quarter, yearId });
    setSchoolYearSheetMode('quarter'); setAddEditSchoolYearSheetOpen(true);
  }
  async function handleSaveSchoolYearOrQuarter(data) {
    if (!uid) { console.warn('AcademicRecordsTab: uid missing on save — entry will not persist'); return; }
    if (schoolYearSheetMode === 'schoolYear') {
      if (editingSchoolYear) await updateSchoolYear(editingSchoolYear.id, data); else await addSchoolYear(data);
    } else {
      if (editingQuarter) await updateQuarter(activeYearId, editingQuarter.quarter.id, data); else await addQuarter(activeYearId, data);
    }
    closeAddEditSchoolYear();
  }
  async function handleDeleteSchoolYearOrQuarter() {
    if (schoolYearSheetMode === 'schoolYear' && editingSchoolYear) await removeSchoolYear(editingSchoolYear.id);
    else if (schoolYearSheetMode === 'quarter' && editingQuarter)  await removeQuarter(activeYearId, editingQuarter.quarter.id);
    closeAddEditSchoolYear();
  }
  const editingItem = schoolYearSheetMode === 'schoolYear'
    ? editingSchoolYear
    : (editingQuarter ? editingQuarter.quarter : null);

  // ─── Derived view data ───
  const today        = todayStr();
  const courseById   = useMemo(() => new Map((courses ?? []).map(c => [c.id, c])), [courses]);
  const yearStart    = activeSchoolYear?.label?.split(/[–-]/)[0]?.trim() ?? '—';
  const yearLabel    = activeSchoolYear?.label ?? 'not set';
  const attendancePct = attendanceDays.required > 0
    ? Math.min(100, Math.round((attendanceDays.attended / attendanceDays.required) * 100))
    : 0;

  return (
    <div className="ar-tab">

      <header className="ar-header">
        <h1 className="ar-title">Academic Records</h1>
        <p className="ar-subtitle">{activeSchoolYear?.label ?? 'No school year set'}</p>
      </header>

      <div className="ar-student-row">
        {STUDENTS.map(s => (
          <button
            key={s}
            className={`ar-student-pill${s === selectedStudent ? ' active' : ''}`}
            onClick={() => setSelectedStudent(s)}
          >{s}</button>
        ))}
      </div>

      {(activeSchoolYear?.quarters?.length ?? 0) > 0 && (
        <div className="ar-quarter-row">
          {activeSchoolYear.quarters.map(q => {
            const isFuture = q.startDate && q.startDate > today;
            const cls = `ar-quarter-pill${q.id === selectedQuarterId ? ' active' : ''}${isFuture ? ' future' : ''}`;
            return (
              <button
                key={q.id}
                className={cls}
                disabled={isFuture}
                onClick={() => !isFuture && setSelectedQuarterId(q.id)}
              >{q.label}</button>
            );
          })}
        </div>
      )}

      <div className="ar-stats-row">
        <div className="ar-stat-card gold">
          <div className="ar-stat-label">Attendance</div>
          <div className="ar-stat-value">{summary.loading ? '—' : attendanceDays.attended}</div>
          <div className="ar-stat-sub">of 175 days required</div>
        </div>
        <div className="ar-stat-card">
          <div className="ar-stat-label">Courses</div>
          <div className="ar-stat-value">{courseCount}</div>
          <div className="ar-stat-sub">enrolled this year</div>
        </div>
        <div className="ar-stat-card">
          <div className="ar-stat-label">School Year</div>
          <div className="ar-stat-value">{yearStart}</div>
          <div className="ar-stat-sub">{yearLabel}</div>
        </div>
      </div>

      <p className="ar-section-label">Grades — {selectedStudent}</p>

      {studentEnrollments.length === 0 ? (
        <div className="ar-grade-card">
          <div className="ar-grade-empty">No courses enrolled. Add courses in Manage Enrollments.</div>
        </div>
      ) : (
        <div className="ar-grade-card">
          {studentEnrollments.map((enr, i) => {
            const course = courseById.get(enr.courseId);
            const gradingType = course?.gradingType ?? GRADING_TYPE_LETTER;
            const grade = grades.find(g => g.enrollmentId === enr.id && g.quarterId === selectedQuarterId);
            return (
              <div key={enr.id} className="ar-grade-row">
                <span className="ar-course-dot" style={{ background: DOT_COLORS[i % DOT_COLORS.length] }} />
                <div className="ar-course-info">
                  <div className="ar-course-name">{course?.name ?? '(deleted course)'}</div>
                  <div className="ar-course-meta">
                    {course?.curriculum && <span>{course.curriculum}</span>}
                    <span className={gradingType === GRADING_TYPE_LETTER ? 'ar-badge-letter' : 'ar-badge-esnu'}>
                      {gradingType === GRADING_TYPE_LETTER ? 'Letter' : 'E/S/N/U'}
                    </span>
                  </div>
                </div>
                {grade ? (
                  <span className={`ar-grade-value ${gradeClass(grade.grade, gradingType)}`}>{grade.grade}</span>
                ) : (
                  <span className="ar-grade-value pending">— pending</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="ar-action-row">
        <button className="ar-action-btn disabled" disabled>
          <span>✏️ Enter Grades</span><span className="soon">Soon</span>
        </button>
        <button className="ar-action-btn disabled" disabled>
          <span>📄 Generate Report</span><span className="soon">Soon</span>
        </button>
      </div>

      <div className="ar-attendance-card">
        <p className="ar-section-label" style={{ marginBottom: 0 }}>
          Attendance — {activeSchoolYear?.label ?? '—'}
        </p>
        <div className="ar-attendance-num">{attendanceDays.attended}</div>
        <p className="ar-attendance-sub">days completed</p>
        <div className="ar-attendance-bar-track">
          <div className="ar-attendance-bar-fill" style={{ width: `${attendancePct}%` }} />
        </div>
        <div className="ar-attendance-labels">
          <span>{attendancePct}% complete</span>
          <span>175 days required (ND)</span>
        </div>
        <div className="ar-attendance-detail">
          <span>Attended: <strong>{attendanceDays.attended}</strong></span>
          <span>Sick: <strong>{attendanceDays.sick}</strong></span>
          <span>School days: <strong>{attendanceDays.total}</strong></span>
        </div>
        <p className="ar-attendance-note">Sick days pulled automatically from Planner</p>
      </div>

      <p className="ar-section-label">Quick Actions</p>

      <div className="ar-quick-actions">
        <button className="ar-action-btn" onClick={() => setCatalogSheetOpen(true)}>
          <span>📚 Manage Course Catalog</span><span>›</span>
        </button>
        <button className="ar-action-btn" onClick={() => setEnrollmentSheetOpen(true)}>
          <span>👤 Manage Enrollments</span><span>›</span>
        </button>
        <button className="ar-action-btn disabled" disabled>
          <span>📥 Import Curriculum Data</span><span className="soon">Soon</span>
        </button>
        <button className="ar-action-btn" onClick={() => setSchoolYearSheetOpen(true)}>
          <span>🗓️ Manage School Year &amp; Quarters</span><span>›</span>
        </button>
        <button className="ar-action-btn disabled" disabled>
          <span>📄 Generate Report Card</span><span className="soon">Soon</span>
        </button>
      </div>

      <CourseCatalogSheet
        open={catalogSheetOpen} onClose={closeCatalog}
        courses={courses} loading={loading} error={error}
        onEditCourse={handleEditCourse} onAddCourse={handleAddCourse}
      />
      <AddEditCourseSheet
        open={addEditSheetOpen} onClose={closeAddEdit}
        onSave={handleSaveCourse} onDelete={handleDeleteCourse}
        course={editingCourse} enrollments={enrollments}
      />
      <EnrollmentSheet
        open={enrollmentSheetOpen} onClose={closeEnrollments}
        enrollments={enrollments} courses={courses}
        loading={enrollmentsLoading} error={enrollmentsError}
        onEditEnrollment={handleEditEnrollment} onAddEnrollment={handleAddEnrollment}
      />
      <AddEditEnrollmentSheet
        open={addEditEnrollmentSheetOpen} onClose={closeAddEditEnrollment}
        onSave={handleSaveEnrollment} onDelete={handleDeleteEnrollment}
        student={enrollingStudent} courses={courses} enrollment={editingEnrollment}
      />
      <SchoolYearSheet
        open={schoolYearSheetOpen} onClose={closeSchoolYearSheets}
        schoolYears={schoolYears}
        loading={schoolYearsLoading} error={schoolYearsError}
        onEditSchoolYear={handleEditSchoolYear} onAddSchoolYear={handleAddSchoolYear}
        onEditQuarter={handleEditQuarter} onAddQuarter={handleAddQuarter}
      />
      <AddEditSchoolYearSheet
        open={addEditSchoolYearSheetOpen} onClose={closeAddEditSchoolYear}
        onSave={handleSaveSchoolYearOrQuarter} onDelete={handleDeleteSchoolYearOrQuarter}
        mode={schoolYearSheetMode} yearId={activeYearId} item={editingItem}
      />

    </div>
  );
}
