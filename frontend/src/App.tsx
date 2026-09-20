import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { DashboardData, Skill, Roadmap, WeekPlan, PracticeTask, AgentLog, ProgressReport } from './types';
import { LandingPage } from './components/LandingPage';
import { ProfileSetup } from './components/ProfileSetup';
import { Dashboard } from './components/Dashboard';
import { SkillDashboard } from './components/SkillDashboard';
import { SkillGapView } from './components/SkillGapView';
import { RoadmapView } from './components/RoadmapView';
import { TodayPlan } from './components/TodayPlan';
import { PracticeSandbox } from './components/PracticeSandbox';
import { ProgressReportView } from './components/ProgressReportView';
import { CopilotDrawer } from './components/CopilotDrawer';
import { AgentActivityPanel } from './components/AgentActivityPanel';
import { AdaptiveModal } from './components/AdaptiveModal';
import { SkillCoverageModal } from './components/SkillCoverageModal';
import { BuildStoryModal } from './components/BuildStoryModal';

import {
  Compass,
  LayoutDashboard,
  Award,
  Target,
  Map,
  Calendar,
  Zap,
  FileBarChart,
  Bot,
  Play,
  User,
  Menu,
  X,
  RefreshCw,
  Layers
} from 'lucide-react';

const DEMO_USER_ID = "demo_alex_rivera";

export function App() {
  const [currentView, setCurrentView] = useState<string>(() => localStorage.getItem('edupath_current_view') || 'landing');
  const [userId, setUserId] = useState<string>(() => localStorage.getItem('edupath_user_id') || DEMO_USER_ID);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [roadmapWeeks, setRoadmapWeeks] = useState<WeekPlan[]>([]);
  const [roadmapVersions, setRoadmapVersions] = useState<Roadmap[]>([]);
  const [practiceTask, setPracticeTask] = useState<PracticeTask | null>(null);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const [progressReport, setProgressReport] = useState<ProgressReport | null>(null);

  const [copilotOpen, setCopilotOpen] = useState(false);
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [coverageModalOpen, setCoverageModalOpen] = useState(false);
  const [buildStoryModalOpen, setBuildStoryModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync currentView to localStorage
  useEffect(() => {
    localStorage.setItem('edupath_current_view', currentView);
  }, [currentView]);

  // Load user data on startup or user change
  useEffect(() => {
    if (userId && currentView !== 'landing' && currentView !== 'profile_setup') {
      loadUserData(userId);
    }
  }, [userId, currentView]);

  const loadUserData = async (uid: string) => {
    setLoading(true);
    try {
      const dData = await api.getDashboard(uid);
      setDashboardData(dData);

      const rData = await api.getRoadmap(uid);
      setRoadmapWeeks(rData.weeks);

      const vData = await api.getRoadmapVersions(uid);
      setRoadmapVersions(vData.versions);

      const tData = await api.getPracticeTask(uid);
      setPracticeTask(tData.task);

      const lData = await api.getAgentLogs(uid);
      setAgentLogs(lData.logs);

      const repData = await api.getProgressReport(uid);
      setProgressReport(repData.report);
    } catch (err) {
      console.error('Failed to load user state:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchDemo = async () => {
    setLoading(true);
    try {
      await api.initDemo();
      setUserId(DEMO_USER_ID);
      localStorage.setItem('edupath_user_id', DEMO_USER_ID);
      await loadUserData(DEMO_USER_ID);
      setCurrentView('dashboard');
    } catch (err) {
      console.error('Demo init error:', err);
      setCurrentView('dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileCreated = async (newUserId: string) => {
    setUserId(newUserId);
    localStorage.setItem('edupath_user_id', newUserId);
    await loadUserData(newUserId);
    setCurrentView('dashboard');
  };

  const handleAssessmentCompleted = async (evalResult: any, adaptation: any) => {
    if (userId) {
      await loadUserData(userId);
      if (adaptation) {
        setExplainModalOpen(true);
      }
    }
  };

  const handleUpdateActivityStatus = async (actId: string, status: string) => {
    try {
      await api.updateActivityStatus(actId, status);
      if (userId) {
        await loadUserData(userId);
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleSelectRoadmapVersion = async (ver: number) => {
    try {
      const rData = await api.getRoadmap(userId, ver);
      setRoadmapWeeks(rData.weeks);
      if (dashboardData) {
        setDashboardData({
          ...dashboardData,
          roadmap: rData.roadmap
        });
      }
    } catch (err) {
      console.error('Version switch failed:', err);
    }
  };

  // Render landing or setup
  if (currentView === 'landing') {
    return (
      <LandingPage
        onStartProfile={() => setCurrentView('profile_setup')}
        onLaunchDemo={handleLaunchDemo}
        onOpenBuildStory={() => setBuildStoryModalOpen(true)}
      />
    );
  }

  if (currentView === 'profile_setup') {
    return (
      <ProfileSetup
        onComplete={handleProfileCreated}
        onCancel={() => setCurrentView('landing')}
      />
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'skills', label: 'My Skills', icon: Award },
    { id: 'gaps', label: 'Skill Gaps', icon: Target },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'practice', label: 'Practice Task', icon: Zap },
    { id: 'report', label: 'Progress Report', icon: FileBarChart }
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-gray-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
              EduPath AI
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const active = currentView === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-3">
          {/* Back to Home/Landing */}
          <button
            onClick={() => setCurrentView('landing')}
            title="Back to Landing Page"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 transition-all border border-gray-800"
          >
            Home
          </button>

          {/* Build Story Hackathon Modal */}
          <button
            onClick={() => setBuildStoryModalOpen(true)}
            title="View Hackathon Build Story (Day 1 & Day 2)"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/30 text-[11px] font-semibold text-indigo-300 transition-all"
          >
            <Layers className="w-3 h-3 text-cyan-400" />
            Build Story
          </button>

          {/* Quick Demo Reload Button */}
          <button
            onClick={handleLaunchDemo}
            title="Reload Alex Rivera Deterministic Demo"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-[11px] font-semibold text-cyan-300 transition-all"
          >
            <Play className="w-3 h-3 text-cyan-400 fill-cyan-400" />
            Demo Mode
          </button>

          {/* Copilot Assistant Trigger Button */}
          <button
            onClick={() => setCopilotOpen(!copilotOpen)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all"
          >
            <Bot className="w-4 h-4 text-cyan-200" />
            <span className="hidden sm:inline">AI Copilot</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111827] border-b border-gray-800 p-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${
                currentView === item.id ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              setBuildStoryModalOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-cyan-300 hover:text-white border-t border-gray-800 mt-2 pt-2"
          >
            <Layers className="w-4 h-4" />
            Hackathon Build Story (Day 1 & Day 2)
          </button>
          <button
            onClick={() => {
              setCurrentView('landing');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-gray-400 hover:text-white border-t border-gray-800 mt-2 pt-2"
          >
            Back to Home / Landing
          </button>
        </div>
      )}

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {loading && !dashboardData ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-400 mb-3" />
            <span className="text-xs">Loading learner profile and adaptive state...</span>
          </div>
        ) : (
          <>
            {currentView === 'dashboard' && dashboardData && (
              <Dashboard
                data={dashboardData}
                onNavigate={view => setCurrentView(view)}
                onStartPractice={() => setCurrentView('practice')}
                onOpenExplainModal={() => setExplainModalOpen(true)}
                onInspectCoverage={() => setCoverageModalOpen(true)}
              />
            )}

            {currentView === 'skills' && dashboardData && (
              <SkillDashboard skills={dashboardData.skills} />
            )}

            {currentView === 'gaps' && dashboardData && (
              <SkillGapView
                gaps={dashboardData.all_gaps}
                onStartPractice={skill => setCurrentView('practice')}
              />
            )}

            {currentView === 'roadmap' && dashboardData && (
              <RoadmapView
                roadmap={dashboardData.roadmap}
                weeks={roadmapWeeks}
                versions={roadmapVersions}
                onSelectVersion={handleSelectRoadmapVersion}
                onActivityStatusChange={handleUpdateActivityStatus}
                onStartPractice={skill => setCurrentView('practice')}
              />
            )}

            {currentView === 'today' && (
              <TodayPlan
                tasks={dashboardData?.activities.slice(0, 3) || []}
                onUpdateStatus={handleUpdateActivityStatus}
                onStartPractice={skill => setCurrentView('practice')}
                onAskAI={topic => setCopilotOpen(true)}
              />
            )}

            {currentView === 'practice' && practiceTask && (
              <PracticeSandbox
                userId={userId}
                task={practiceTask}
                onAssessmentCompleted={handleAssessmentCompleted}
                onViewRoadmap={() => setCurrentView('roadmap')}
              />
            )}

            {currentView === 'report' && progressReport && (
              <ProgressReportView
                report={progressReport}
                onNavigateToRoadmap={() => setCurrentView('roadmap')}
              />
            )}
          </>
        )}

        {/* Global Agent Activity Stream Bar at Bottom */}
        <div className="mt-12 pt-6 border-t border-gray-800">
          <AgentActivityPanel logs={agentLogs} />
        </div>
      </main>

      {/* AI Copilot Drawer */}
      <CopilotDrawer
        userId={userId}
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
      />

      {/* Adaptive Replanning Explanation Modal */}
      {dashboardData && (
        <AdaptiveModal
          isOpen={explainModalOpen}
          onClose={() => setExplainModalOpen(false)}
          diff={dashboardData.roadmap.diff_summary}
          version={dashboardData.roadmap.version}
        />
      )}

      {/* Target Role Capability Matrix Modal */}
      <SkillCoverageModal
        isOpen={coverageModalOpen}
        onClose={() => setCoverageModalOpen(false)}
        matrix={dashboardData?.capability_matrix}
        percentage={dashboardData?.skill_coverage.percentage || 68}
        onStartPractice={() => setCurrentView('practice')}
      />

      {/* Hackathon Build Story & LinkedIn Artifacts Modal */}
      <BuildStoryModal
        isOpen={buildStoryModalOpen}
        onClose={() => setBuildStoryModalOpen(false)}
      />
    </div>
  );
}
export default App;
