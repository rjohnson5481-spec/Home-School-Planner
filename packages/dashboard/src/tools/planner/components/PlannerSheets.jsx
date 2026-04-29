import EditSheet       from './EditSheet.jsx';
import UploadSheet     from './UploadSheet.jsx';
import AddSubjectSheet from './AddSubjectSheet.jsx';
import MonthSheet      from './MonthSheet.jsx';

export default function PlannerSheets(p) {
  return (
    <>
      {p.editTarget && (
        <EditSheet subject={p.editTarget.subject} data={p.dayData[p.editTarget.subject]}
          onSave={data => { p.updateCell(p.editTarget.subject, p.editTarget.day, data); p.setEditTarget(null); }}
          onDelete={() => { p.removeSubject(p.editTarget.subject); p.setEditTarget(null); }}
          onClose={() => p.setEditTarget(null)} />
      )}
      {p.showUpload && (
        <UploadSheet pdfImport={p.pdfImport} onApply={p.handleApplySchedule}
          onConfirmImport={p.handleConfirmImport}
          onClose={() => { p.setShowUpload(false); p.pdfImport.reset(); }} />
      )}
      {p.showAddSubject && (
        <AddSubjectSheet existingSubjects={p.subjects} presets={p.plannerSubjects}
          weekDates={p.weekDates} currentDayIndex={p.day} currentStudent={p.student} students={p.students}
          onAdd={p.handleBatchAddSubject}
          onAddAllDay={(name, note) => { p.updateCell('allday', p.day, { lesson: name, note, done: false, flag: false }); p.setShowAddSubject(false); }}
          onEditAllDay={() => { p.setShowAddSubject(false); p.setEditTarget({ subject: 'allday', day: p.day }); }}
          onClose={() => p.setShowAddSubject(false)} />
      )}
      {p.showMonthPicker && (
        <MonthSheet weekId={p.weekId} onSelectDay={p.handleMonthDaySelect} onClose={() => p.setShowMonthPicker(false)} />
      )}
    </>
  );
}
