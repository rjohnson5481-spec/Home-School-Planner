// Home tab — tool cards wired to shell tab switching.
// Planner + Rewards switch tabs in-shell; TE Extractor navigates externally.
import ToolCard from '../components/ToolCard';
import './HomeTab.css';

export default function HomeTab({ onTabChange }) {
  return (
    <div className="home-tab">
      <p className="home-section-label">Tools</p>
      <div className="home-tool-grid">
        <ToolCard
          name="Weekly Planner"
          description="Plan and track weekly lessons for Orion and Malachi."
          icon="PL"
          available
          onClick={() => onTabChange('planner')}
        />
        <ToolCard
          name="Reward Tracker"
          description="Earn and redeem points for good work and character."
          icon="RT"
          available
          onClick={() => onTabChange('rewards')}
        />
        <ToolCard
          name="TE Extractor"
          description="Extract questions and vocabulary from BJU Press Teacher Edition PDFs."
          icon="TE"
          href="/te-extractor/"
          available
        />
        <ToolCard
          name="Academic Records"
          description="Transcripts, grades, and attendance — coming soon."
          icon="AR"
          available={false}
        />
      </div>
    </div>
  );
}
