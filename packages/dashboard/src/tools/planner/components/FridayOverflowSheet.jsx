import './FridayOverflowSheet.css';

// Interstitial shown between Sick Day confirmation and the cascade, when the
// current student has any non-allday lesson on Friday. The sick-day cascade
// only shifts lessons forward within the same week and silently drops whatever
// lands past Friday — this sheet forces an explicit decision on that Friday
// content before the cascade runs.
//
// Props:
//   student        — string, shown in the header
//   onMoveToMonday — async, moves every Friday lesson to next Monday then proceeds
//   onDeleteFresh  — async, deletes every Friday lesson then proceeds
//   onCancel       — closes the sheet without applying the sick day
export default function FridayOverflowSheet({ student, onMoveToMonday, onDeleteFresh, onCancel }) {
  return (
    <div className="fo-overlay" onClick={onCancel}>
      <div className="fo-sheet" onClick={e => e.stopPropagation()}>
        <div className="fo-handle" />

        <div className="fo-header">
          <span className="fo-title">Friday overflow — {student}</span>
          <button className="fo-close" onClick={onCancel} aria-label="Close">✕</button>
        </div>

        <div className="fo-body">
          <p className="fo-msg">
            {student} has lessons scheduled on Friday. Pick where they should go
            before the sick day cascade runs — otherwise they would be dropped
            at the end of the week.
          </p>
        </div>

        <div className="fo-footer">
          <button className="fo-cancel" onClick={onCancel}>Cancel</button>
          <button className="fo-delete" onClick={onDeleteFresh}>Delete &amp; Start Fresh</button>
          <button className="fo-confirm" onClick={onMoveToMonday}>Move to Monday</button>
        </div>
      </div>
    </div>
  );
}
