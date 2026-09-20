import React, { useState } from 'react';
import { Skill } from '../types';
import { Award, ShieldCheck, HelpCircle, ChevronRight, X, ExternalLink, Filter, Search, CheckCircle2, AlertCircle, TrendingUp, Sparkles } from 'lucide-react';

interface SkillDashboardProps {
  skills: Skill[];
}

export const SkillDashboard: React.FC<SkillDashboardProps> = ({ skills }) => {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [filterClass, setFilterClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const demonstratedCount = skills.filter(s => s.classification === 'demonstrated').length;
  const inferredCount = skills.filter(s => s.classification === 'inferred').length;
  const unknownCount = skills.filter(s => s.classification === 'unknown').length;

  const filteredSkills = skills.filter(s => {
    const matchesFilter = filterClass === 'all' || s.classification === filterClass;
    const matchesSearch = s.skill_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Evidence Detail Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0f1523] border border-gray-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setSelectedSkill(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                <Award className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedSkill.skill_name}</h3>
                <span className="text-xs text-indigo-300 font-medium">{selectedSkill.category}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
              <div className="p-3 rounded-xl bg-gray-950 border border-gray-800">
                <span className="text-gray-400 block mb-1">Current Mastery</span>
                <span className="font-bold text-white text-sm">{selectedSkill.current_level}</span>
                <span className="text-gray-400 ml-1 font-mono">({selectedSkill.proficiency_score}%)</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-950 border border-gray-800">
                <span className="text-gray-400 block mb-1">Verification Confidence</span>
                <span className="font-bold text-cyan-400 text-sm">
                  {Math.round(selectedSkill.confidence * 100)}% ({selectedSkill.confidence >= 0.8 ? 'High' : selectedSkill.confidence >= 0.5 ? 'Moderate' : 'Low'})
                </span>
              </div>
            </div>

            {/* Evidence List */}
            <div className="mb-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Evidence & Proven Work Citations
              </h4>
              <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 text-xs text-gray-300 space-y-2">
                {selectedSkill.evidence && selectedSkill.evidence.length > 0 ? (
                  selectedSkill.evidence.map((ev, idx) => (
                    <div key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{ev}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic">No direct project, code, or credential evidence found in profile.</div>
                )}
              </div>
            </div>

            {/* Recommended Action */}
            {selectedSkill.recommended_action && (
              <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs">
                <span className="font-bold text-indigo-300 block mb-1">Pedagogical Recommendation:</span>
                <span className="text-gray-300 leading-relaxed">{selectedSkill.recommended_action}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header & Metric Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Your Evidenced Skill Map</h2>
          <p className="text-xs text-gray-400 mt-1">
            EduPath classifies competencies based on concrete proof from projects, certificates, and codebases.
          </p>
        </div>

        {/* Quick Summary Counts */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-400">
            {demonstratedCount} Demonstrated
          </div>
          <div className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] font-semibold text-blue-400">
            {inferredCount} Inferred
          </div>
          <div className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] font-semibold text-amber-400">
            {unknownCount} Unverified
          </div>
        </div>
      </div>

      {/* Controls: Search & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#0f1523] border border-gray-800">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search skills or categories..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-gray-950 border border-gray-700 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] text-gray-400 mr-1 font-medium">Classification:</span>
          {['all', 'demonstrated', 'inferred', 'unknown'].map(cls => (
            <button
              key={cls}
              onClick={() => setFilterClass(cls)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                filterClass === cls
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSkills.map((skill, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedSkill(skill)}
            className="p-5 rounded-2xl bg-[#0f1523] border border-gray-800 hover:border-indigo-500/50 hover:bg-gray-900/90 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                    {skill.skill_name}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                    skill.classification === 'demonstrated'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : skill.classification === 'inferred'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {skill.classification}
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-gray-300">{skill.proficiency_score}%</span>
              </div>

              <div className="w-full bg-gray-800/80 h-2 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all ${
                    skill.proficiency_score >= 80 ? 'bg-emerald-400' : skill.proficiency_score >= 50 ? 'bg-cyan-400' : 'bg-amber-400'
                  }`}
                  style={{ width: `${skill.proficiency_score}%` }}
                />
              </div>

              {/* Evidence snippet preview */}
              <p className="text-xs text-gray-400 line-clamp-1 mb-3">
                {skill.evidence && skill.evidence.length > 0 ? skill.evidence[0] : 'No direct project evidence recorded.'}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-800/60">
              <span className="text-[11px] text-gray-400">{skill.category}</span>
              <span className="flex items-center gap-1 group-hover:text-indigo-300 text-[11px] font-semibold">
                Inspect Evidence <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
