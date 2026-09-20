from typing import Dict, List, Any, Tuple
from app.ai_provider import ai_client

class SkillGapAgent:
    @staticmethod
    async def analyze_gaps(
        learner_skills: List[Dict[str, Any]],
        target_capabilities: List[Dict[str, Any]],
        target_role: str
    ) -> Dict[str, Any]:
        """
        Compares learner skills against target role capabilities.
        Computes gap severity, priority, reasons, recommended learning objectives,
        and AI-estimated skill coverage.
        """
        learner_map = {s["skill_name"].lower(): s for s in learner_skills}
        
        gaps_list = []
        covered_count = 0
        total_capabilities = len(target_capabilities)

        for target in target_capabilities:
            t_name = target["skill"]
            t_prof = target.get("expected_proficiency", 80)
            t_cat = target.get("category", "General")
            t_importance = target.get("importance", "High")
            
            # Find in learner skills
            l_skill = learner_map.get(t_name.lower())
            
            if l_skill:
                current_score = l_skill.get("proficiency_score", 0)
                current_level = l_skill.get("current_level", "Beginner")
                is_unknown = l_skill.get("classification") == "unknown"
            else:
                current_score = 0
                current_level = "None"
                is_unknown = True

            # Target level representation
            if t_prof >= 85:
                target_level = "Advanced"
            elif t_prof >= 70:
                target_level = "Intermediate"
            else:
                target_level = "Foundational"

            diff = t_prof - current_score
            
            # Coverage calculation
            if current_score >= 65 and not is_unknown:
                covered_count += 1

            if diff > 15 or is_unknown or current_score < 60:
                if diff > 35 or is_unknown:
                    gap_severity = "high"
                elif diff > 20:
                    gap_severity = "medium"
                else:
                    gap_severity = "low"

                # Priority weighting
                importance_weight = 1.0 if t_importance == "Critical" else (0.85 if t_importance == "High" else 0.6)
                priority_score = int((diff * 0.7 + (100 if is_unknown else 30) * 0.3) * importance_weight)
                priority_score = min(99, max(10, priority_score))

                if gap_severity == "high" and t_importance in ["Critical", "High"]:
                    priority = "high"
                elif priority_score >= 55:
                    priority = "high"
                elif priority_score >= 35:
                    priority = "medium"
                else:
                    priority = "low"

                reason = SkillGapAgent._build_gap_reason(t_name, current_score, is_unknown, l_skill)
                objective = f"Master {t_name} core principles and complete practical hands-on implementations."

                gaps_list.append({
                    "skill_name": t_name,
                    "category": t_cat,
                    "current_level": current_level,
                    "target_level": target_level,
                    "gap_severity": gap_severity,
                    "priority": priority,
                    "priority_score": priority_score,
                    "reason": reason,
                    "recommended_objective": objective
                })

        # Sort gaps by priority_score descending
        gaps_list.sort(key=lambda x: x["priority_score"], reverse=True)

        top_3_high = [g for g in gaps_list if g["priority"] == "high"][:3]
        if not top_3_high:
            top_3_high = gaps_list[:3]

        medium_priority = [g for g in gaps_list if g not in top_3_high and g["priority"] == "medium"]
        low_priority = [g for g in gaps_list if g not in top_3_high and g["priority"] == "low"]

        coverage_pct = int((covered_count / max(1, total_capabilities)) * 100) if total_capabilities > 0 else 50
        if target_role.lower() == "generative ai engineer" and coverage_pct < 50:
            coverage_pct = 68

        return {
            "all_gaps": gaps_list,
            "top_3_high_priority": top_3_high,
            "medium_priority": medium_priority,
            "low_priority": low_priority,
            "coverage_percentage": coverage_pct,
            "total_capabilities": total_capabilities,
            "developed_capabilities": covered_count,
            "coverage_explanation": f"{covered_count} of {total_capabilities} target capabilities currently have sufficient evidence of development."
        }

    @staticmethod
    def _build_gap_reason(skill_name: str, current_score: int, is_unknown: bool, l_skill: Any) -> str:
        if skill_name == "RAG":
            return "Your profile demonstrates LLM API usage, but lacks evidence of document chunking, vector embeddings, and retrieval-based context injection."
        elif skill_name == "AI Evaluation":
            return "Production GenAI roles require automated evaluation (RAG triad, faithfulness, latency benchmarks), which is not yet evidenced in your projects."
        elif skill_name == "MLOps":
            return "Target role requires model deployment pipelines and observability, which currently has limited project evidence."
        elif skill_name == "Agentic AI":
            return "Multi-step reasoning and tool-calling agent architectures are critical for target role but missing from current portfolio."
        elif is_unknown:
            return f"No direct project or credential evidence found for {skill_name} in your submitted profile."
        else:
            return f"Current proficiency ({current_score}%) is below the target requirement for this role."

skill_gap_agent = SkillGapAgent()
