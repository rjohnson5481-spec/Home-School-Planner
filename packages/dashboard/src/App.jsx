import { useState } from 'react';
import { useAuth } from '@homeschool/shared';
import SignIn              from './components/SignIn';
import BottomNav           from './components/BottomNav';
import HomeTab             from './tabs/HomeTab';
import PlannerTab          from './tabs/PlannerTab';
import RewardsTab          from './tabs/RewardsTab';
import AcademicRecordsTab  from './tabs/AcademicRecordsTab';

export default function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  if (loading) return null;
  if (!user)   return <SignIn />;

  return (
    <div className="app-shell">
      <div className="shell-content">
        {activeTab === 'home'     && <HomeTab onTabChange={setActiveTab} />}
        {activeTab === 'planner'  && <PlannerTab />}
        {activeTab === 'rewards'  && <RewardsTab />}
        {activeTab === 'academic' && <AcademicRecordsTab />}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
