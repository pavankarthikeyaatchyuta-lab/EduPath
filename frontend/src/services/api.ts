import { DashboardData, Skill, SkillGap, Roadmap, WeekPlan, PracticeTask, EvaluationResult, AgentLog, ProgressReport } from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL 
  ? `${(import.meta as any).env.VITE_API_BASE_URL.replace(/\/$/, '')}/api` 
  : '/api';

export const api = {
  async healthCheck() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  async initDemo(): Promise<{ status: string; user_id: string; message: string }> {
    const res = await fetch(`${API_BASE}/demo/init`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to initialize demo');
    return res.json();
  },

  async getDashboard(userId: string): Promise<DashboardData> {
    const res = await fetch(`${API_BASE}/dashboard/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch dashboard data');
    return res.json();
  },

  async getSkills(userId: string): Promise<{ skills: Skill[] }> {
    const res = await fetch(`${API_BASE}/skills/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch skills');
    return res.json();
  },

  async getRoadmap(userId: string, version?: number): Promise<{ roadmap: Roadmap; weeks: WeekPlan[]; activities_count: number }> {
    const url = version ? `${API_BASE}/roadmap/${userId}?version=${version}` : `${API_BASE}/roadmap/${userId}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch roadmap');
    return res.json();
  },

  async getRoadmapVersions(userId: string): Promise<{ versions: Roadmap[] }> {
    const res = await fetch(`${API_BASE}/roadmap/${userId}/versions`);
    if (!res.ok) throw new Error('Failed to fetch roadmap versions');
    return res.json();
  },

  async getTodayPlan(userId: string): Promise<{ today_tasks: any[] }> {
    const res = await fetch(`${API_BASE}/today/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch today plan');
    return res.json();
  },

  async updateActivityStatus(activityId: string, status: string) {
    const res = await fetch(`${API_BASE}/activity/${activityId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update activity status');
    return res.json();
  },

  async getPracticeTask(userId: string, skill?: string): Promise<{ task: PracticeTask }> {
    const url = skill ? `${API_BASE}/practice/${userId}?skill=${encodeURIComponent(skill)}` : `${API_BASE}/practice/${userId}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch practice task');
    return res.json();
  },

  async submitPractice(userId: string, taskId: string, skillName: string, submissionText: string, isDemoFlow: boolean = false) {
    const res = await fetch(`${API_BASE}/practice/${userId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task_id: taskId,
        skill_name: skillName,
        submission_text: submissionText,
        is_demo_flow: isDemoFlow
      })
    });
    if (!res.ok) throw new Error('Failed to evaluate submission');
    return res.json();
  },

  async askCopilot(userId: string, query: string): Promise<{ query: string; response: string }> {
    const res = await fetch(`${API_BASE}/copilot/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    if (!res.ok) throw new Error('Failed to query copilot');
    return res.json();
  },

  async getAgentLogs(userId: string): Promise<{ logs: AgentLog[] }> {
    const res = await fetch(`${API_BASE}/agent-logs/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch agent logs');
    return res.json();
  },

  async getProgressReport(userId: string): Promise<{ report: ProgressReport }> {
    const res = await fetch(`${API_BASE}/reports/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch progress report');
    return res.json();
  },

  async uploadResume(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/profile/upload-resume`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to upload resume');
    return res.json();
  },

  async createProfile(payload: any) {
    const res = await fetch(`${API_BASE}/profile/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to create profile');
    return res.json();
  }
};
