import React, { useState } from 'react';
import { Upload, CheckCircle2, ArrowRight, ArrowLeft, Loader2, Sparkles, Plus, X, FileText, UserCheck, BookOpen } from 'lucide-react';
import { api } from '../services/api';

interface ProfileSetupProps {
  onComplete: (userId: string) => void;
  onCancel: () => void;
}

export const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Form state
  const [name, setName] = useState('Alex Rivera');
  const [currentRole, setCurrentRole] = useState('Junior AI Developer');
  const [education, setEducation] = useState('B.S. in Computer Science');
  const [yearsExp, setYearsExp] = useState(2.0);
  const [targetRole, setTargetRole] = useState('Generative AI Engineer');
  const [careerGoal, setCareerGoal] = useState('Master retrieval-augmented generation and multi-agent production pipelines.');
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [learningStyle, setLearningStyle] = useState('hands-on');

  // Manual skills & projects
  const [manualSkills, setManualSkills] = useState<string[]>(['Python', 'FastAPI', 'Machine Learning', 'LLM APIs', 'REST APIs', 'SQL']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [extractedAnalysis, setExtractedAnalysis] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const availableRoles = [
    'Generative AI Engineer',
    'Machine Learning Engineer',
    'Data Scientist',
    'Backend Developer',
    'Full Stack Developer',
    'AI Product Engineer'
  ];

  const handleApplyPreset = (presetType: 'genai' | 'backend' | 'ml') => {
    if (presetType === 'genai') {
      setName('Alex Rivera');
      setCurrentRole('Junior AI Developer');
      setTargetRole('Generative AI Engineer');
      setYearsExp(2.0);
      setManualSkills(['Python', 'FastAPI', 'Machine Learning', 'LLM APIs', 'REST APIs', 'SQL']);
      setCareerGoal('Build enterprise-grade RAG pipelines and autonomous tool-calling agents.');
    } else if (presetType === 'backend') {
      setName('Morgan Chen');
      setCurrentRole('Software Developer');
      setTargetRole('Backend Developer');
      setYearsExp(3.0);
      setManualSkills(['Python', 'Django', 'PostgreSQL', 'Docker', 'Redis']);
      setCareerGoal('Master microservice system design and high-concurrency API architectures.');
    } else if (presetType === 'ml') {
      setName('Priya Sharma');
      setCurrentRole('Data Analyst');
      setTargetRole('Machine Learning Engineer');
      setYearsExp(2.5);
      setManualSkills(['Python', 'Pandas', 'SQL', 'Scikit-Learn', 'Statistics']);
      setCareerGoal('Transition into production MLOps and distributed deep learning models.');
    }
  };

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !manualSkills.includes(newSkillInput.trim())) {
      setManualSkills([...manualSkills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setManualSkills(manualSkills.filter(s => s !== skill));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      setIsUploading(true);
      try {
        const res = await api.uploadResume(file);
        if (res.extracted_analysis) {
          setExtractedAnalysis(res.extracted_analysis);
          if (res.extracted_analysis.name) setName(res.extracted_analysis.name);
          if (res.extracted_analysis.current_role) setCurrentRole(res.extracted_analysis.current_role);
          if (res.extracted_analysis.education) setEducation(res.extracted_analysis.education);
          if (res.extracted_analysis.demonstrated_skills) {
            const extractedSkills = res.extracted_analysis.demonstrated_skills.map((s: any) => s.skill);
            setManualSkills(prev => Array.from(new Set([...prev, ...extractedSkills])));
          }
        }
      } catch (err) {
        console.error('File upload error:', err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmitProfile = async () => {
    setLoading(true);
    setLoadingStep(1);
    await new Promise(r => setTimeout(r, 500));
    setLoadingStep(2);
    await new Promise(r => setTimeout(r, 600));
    setLoadingStep(3);
    await new Promise(r => setTimeout(r, 700));
    setLoadingStep(4);
    await new Promise(r => setTimeout(r, 600));
    setLoadingStep(5);

    try {
      const payload = {
        name,
        current_role: currentRole,
        education,
        years_experience: Number(yearsExp),
        target_role: targetRole,
        career_goal: careerGoal,
        weekly_hours: Number(weeklyHours),
        learning_style: learningStyle,
        manual_skills: manualSkills,
        projects: extractedAnalysis?.projects || [
          {
            title: 'AI Resume & Document Pipeline',
            description: 'Engineered REST endpoints with Python and FastAPI.',
            technologies: manualSkills
          }
        ]
      };

      const res = await api.createProfile(payload);
      if (res.user_id) {
        onComplete(res.user_id);
      }
    } catch (err) {
      console.error('Profile creation error:', err);
      alert('Error creating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-white flex flex-col items-center justify-center p-6 bg-grid-pattern relative">
      {/* Loading Modal */}
      {loading && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0f1523] border border-gray-700 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center glow-border">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">EduPath Agent is Analyzing Your Profile</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Generating your evidence-backed skill gap matrix, prerequisite dependencies, and adaptive roadmap.
            </p>

            <div className="space-y-3 text-left">
              {[
                { title: 'Reading resume & document text', done: loadingStep >= 1, active: loadingStep === 1 },
                { title: 'Classifying demonstrated vs inferred capabilities', done: loadingStep >= 2, active: loadingStep === 2 },
                { title: `Synthesizing ${targetRole} target competencies`, done: loadingStep >= 3, active: loadingStep === 3 },
                { title: 'Structuring multi-week personalized roadmap', done: loadingStep >= 4, active: loadingStep === 4 },
                { title: 'Curating authoritative learning resources & sandbox', done: loadingStep >= 5, active: loadingStep === 5 },
              ].map((s, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  {s.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : s.active ? (
                    <div className="w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-gray-700 shrink-0" />
                  )}
                  <span className={s.done ? 'text-slate-200 font-medium' : s.active ? 'text-cyan-300 font-bold' : 'text-slate-500'}>
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl w-full bg-[#0f1523] border border-gray-800 rounded-2xl p-7 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Setup Your Learning Profile</h2>
            <p className="text-xs text-gray-400 mt-1">
              Step {step} of 3: {step === 1 ? 'Career Goal & Profile' : step === 2 ? 'Resume & Work Evidence' : 'Preferences & Target Skills'}
            </p>
          </div>
          <button onClick={onCancel} className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-gray-900">
            Cancel
          </button>
        </div>

        {/* Quick Sample Presets */}
        <div className="mb-6 p-3 rounded-xl bg-gray-950/60 border border-gray-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] text-gray-400 font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Demo Presets:
          </span>
          <button
            onClick={() => handleApplyPreset('genai')}
            className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30 text-[11px] transition-all"
          >
            Alex Rivera (GenAI)
          </button>
          <button
            onClick={() => handleApplyPreset('backend')}
            className="px-2.5 py-1 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 font-semibold border border-gray-700 text-[11px] transition-all"
          >
            Backend Developer
          </button>
          <button
            onClick={() => handleApplyPreset('ml')}
            className="px-2.5 py-1 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 font-semibold border border-gray-700 text-[11px] transition-all"
          >
            ML Engineer
          </button>
        </div>

        {/* Step 1: Personal & Career Goal */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-950 border border-gray-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">Current Role</label>
                <input
                  type="text"
                  value={currentRole}
                  onChange={e => setCurrentRole(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-950 border border-gray-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">Years of Experience</label>
                <input
                  type="number"
                  step="0.5"
                  value={yearsExp}
                  onChange={e => setYearsExp(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-950 border border-gray-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">Target Career Role</label>
              <select
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-950 border border-gray-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                {availableRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">Primary Career Goal</label>
              <textarea
                value={careerGoal}
                onChange={e => setCareerGoal(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-950 border border-gray-700 text-white text-xs focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
              >
                Next: Document Evidence
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Documents & Upload */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2">
                Upload Resume or Project Document (PDF / Text)
              </label>
              <div className="border-2 border-dashed border-gray-700 hover:border-indigo-500/70 rounded-2xl p-6 text-center cursor-pointer relative bg-gray-950/40 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.txt,.docx"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <div className="text-sm font-semibold text-slate-200">
                  {resumeFile ? resumeFile.name : 'Click to upload resume (or drag file here)'}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {isUploading ? 'Extracting text and identifying demonstrated skills...' : 'Supports PDF, TXT (Auto-extracts demonstrated & inferred capabilities)'}
                </div>
              </div>

              {extractedAnalysis && (
                <div className="mt-3 p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 animate-fade-in">
                  <div className="font-bold flex items-center gap-1.5 mb-1 text-white">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Evidence Extracted from Resume:
                  </div>
                  Identified {extractedAnalysis.demonstrated_skills?.length || 0} demonstrated skills with project citations.
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">Education / Degree</label>
              <input
                type="text"
                value={education}
                onChange={e => setEducation(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-950 border border-gray-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-between pt-3">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 text-xs font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
              >
                Next: Learning Preferences
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Learning Preferences & Skills */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">Weekly Hours</label>
                <select
                  value={weeklyHours}
                  onChange={e => setWeeklyHours(parseInt(e.target.value) || 10)}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-950 border border-gray-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value={5}>5 hrs / week (Casual)</option>
                  <option value={10}>10 hrs / week (Standard)</option>
                  <option value={20}>20 hrs / week (Accelerated)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">Learning Style</label>
                <select
                  value={learningStyle}
                  onChange={e => setLearningStyle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-950 border border-gray-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="hands-on">Hands-on (Code Sandbox)</option>
                  <option value="visual">Visual (Diagrams & Videos)</option>
                  <option value="reading">Reading (Official Docs & Papers)</option>
                  <option value="mixed">Mixed Balanced Approach</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2">Known Technical Skills</label>
              <div className="flex flex-wrap gap-1.5 mb-3 max-h-36 overflow-y-auto pr-1">
                {manualSkills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold"
                  >
                    {skill}
                    <button onClick={() => handleRemoveSkill(skill)} className="hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={e => setNewSkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  placeholder="e.g. PyTorch, Docker, LangChain"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-gray-950 border border-gray-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-200 text-xs font-semibold border border-gray-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-800">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 text-xs font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                onClick={handleSubmitProfile}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-xl shadow-indigo-600/30"
              >
                <Sparkles className="w-4 h-4" />
                Generate My Adaptive Path
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
