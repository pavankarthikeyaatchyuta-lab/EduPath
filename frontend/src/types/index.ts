export type SkillClassification = 'demonstrated' | 'inferred' | 'unknown';
export type GapSeverity = 'high' | 'medium' | 'low';
export type PriorityLevel = 'high' | 'medium' | 'low';
export type ActivityType = 'learn' | 'practice' | 'assessment' | 'project';
export type ActivityStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';

export interface Skill {
  id?: string;
  skill_name: string;
  category: string;
  current_level: string;
  target_level: string;
  proficiency_score: number;
  confidence: number;
  classification: SkillClassification;
  evidence: string[];
  recommended_action?: string;
}

export interface SkillGap {
  id?: string;
  skill_name: string;
  category: string;
  current_level: string;
  target_level: string;
  gap_severity: GapSeverity;
  priority: PriorityLevel;
  priority_score: number;
  reason: string;
  recommended_objective: string;
}

export interface Activity {
  id: string;
  roadmap_id: string;
  week_number: number;
  sequence_order: number;
  title: string;
  activity_type: ActivityType;
  skill_name: string;
  duration_min: number;
  description: string;
  status: ActivityStatus;
  is_new_addition: number | boolean;
  is_moved: number | boolean;
  score?: number | null;
  resource_url?: string;
  resource_title?: string;
  resource_type?: string;
}

export interface RoadmapDiff {
  version_from?: number;
  version_to?: number;
  trigger_skill?: string;
  trigger_score?: number;
  weakness_detected?: string;
  added_activities?: string[];
  moved_activities?: string[];
  reason?: string;
  type?: string;
  added?: string[];
}

export interface Roadmap {
  id: string;
  user_id: string;
  version: number;
  title: string;
  is_active: boolean | number;
  change_reason?: string;
  diff_summary?: RoadmapDiff;
  created_at: string;
}

export interface WeekPlan {
  week_number: number;
  activities: Activity[];
}

export interface PracticeTask {
  id: string;
  skill_name: string;
  task_title: string;
  practice_type: string;
  objective: string;
  requirements: string[];
  evaluation_criteria: string[];
  initial_code_template: string;
  difficulty: string;
}

export interface EvaluationResult {
  score: number;
  score_label: string;
  strengths: string[];
  weaknesses: string[];
  primary_weakness: string;
  recommended_next_step: string;
  reasoning: string;
}

export interface AgentLog {
  id: string;
  user_id: string;
  agent_name: string;
  action_type: string;
  message: string;
  details?: any;
  timestamp: string;
}

export interface CapabilityItem {
  skill: string;
  category: string;
  importance: 'Critical' | 'High' | 'Medium';
  expected_proficiency: number;
  current_proficiency: number;
  current_level: string;
  classification: SkillClassification;
  evidence: string[];
  status: 'covered' | 'developing' | 'missing';
}

export interface CapabilityMatrix {
  target_role: string;
  total_capabilities: number;
  covered_count: number;
  developing_count: number;
  missing_count: number;
  coverage_percentage: number;
  covered: CapabilityItem[];
  developing: CapabilityItem[];
  missing: CapabilityItem[];
}

export interface DashboardData {
  user: {
    id: string;
    name: string;
    current_role?: string;
    target_role: string;
    career_goal?: string;
    weekly_hours?: number;
    learning_style?: string;
  };
  skills: Skill[];
  top_gaps: SkillGap[];
  all_gaps: SkillGap[];
  persistent_struggles?: Array<{ skill_name: string; scores: number[]; message: string }>;
  capability_matrix?: CapabilityMatrix;
  skill_coverage: {
    percentage: number;
    developed_count: number;
    total_count: number;
    label: string;
  };
  roadmap: Roadmap;
  activities: Activity[];
  next_best_action: {
    title: string;
    skill_name: string;
    duration_min: number;
    reason: string;
  };
  progress_metric: {
    completed_tasks: number;
    total_tasks: number;
    current_week: number;
  };
}

export interface ProgressReport {
  title: string;
  date: string;
  skills_acquired: string[];
  skills_in_progress: string[];
  remaining_gaps: string[];
  recent_improvement: {
    skill: string;
    trajectory: string;
    assessment_score: number;
  };
  recommendations: string[];
  ai_summary: string;
}
