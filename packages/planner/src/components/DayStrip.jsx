import { DAY_SHORT } from '../constants/days.js';
import './DayStrip.css';

// Props: dates (array of 5 Date objects Mon-Fri), selected (0-4), onSelect,
//        sickDayIndices (Set of day indices that are sick days for current student)
export default function DayStrip({ dates, selected, onSelect, sickDayIndices = new Set() }) {
  return (
    <nav className="day-strip" role="tablist" aria-label="Day selector">
      {dates.map((date, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={selected === i}
          className={`day-strip-tab${selected === i ? ' day-strip-tab--active' : ''}`}
          onClick={() => onSelect(i)}
        >
          <span className="day-strip-name">{DAY_SHORT[i]}</span>
          <span className="day-strip-date">{date.getDate()}</span>
          {sickDayIndices.has(i) && (
            <span className="day-strip-sick-dot" aria-label="Sick day" />
          )}
        </button>
      ))}
    </nav>
  );
}
