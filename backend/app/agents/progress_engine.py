from typing import Dict, List, Any, Optional
from datetime import datetime, timezone
from app.database import db_session, log_agent_activity

class ProgressEngine:
    @staticmethod
    def update_skill_progress(
        user_id: str,
        skill_name: str,
        assessment_score: int,
        weakness: str = ""
    ) -> Dict[str, Any]:
        """
        Applies sensible, bounded updates to learner skill proficiency based on assessment score.
        Checks for persistent struggle across recent attempts.
        """
        now_str = datetime.now(timezone.utc).isoformat()
        with db_session() as conn:
            cursor = conn.cursor()
            
            # Fetch existing skill record
            cursor.execute(
                "SELECT proficiency_score, current_level, confidence FROM skills WHERE user_id = ? AND skill_name = ?",
                (user_id, skill_name)
            )
            row = cursor.fetchone()
            
            if row:
                old_score = row["proficiency_score"]
                # Bounded update: 60% historical + 40% new assessment
                new_score = int(round(old_score * 0.6 + assessment_score * 0.4))
                new_score = min(98, max(15, new_score))
                
                if new_score >= 85:
                    new_level = "Advanced"
                elif new_score >= 65:
                    new_level = "Intermediate"
                elif new_score >= 40:
                    new_level = "Developing"
                else:
                    new_level = "Beginner"
                
                cursor.execute(
                    """UPDATE skills 
                       SET proficiency_score = ?, current_level = ?, confidence = MIN(0.95, confidence + 0.1), updated_at = ?
                       WHERE user_id = ? AND skill_name = ?""",
                    (new_score, new_level, now_str, user_id, skill_name)
                )
            else:
                old_score = 30
                new_score = assessment_score
                new_level = "Developing" if new_score >= 50 else "Beginner"
                cursor.execute(
                    """INSERT INTO skills (id, user_id, skill_name, category, current_level, target_level, proficiency_score, confidence, classification, evidence, updated_at)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    (f"{user_id}_{skill_name}", user_id, skill_name, "General", new_level, "Intermediate", new_score, 0.65, "demonstrated", "[]", now_str)
                )

            # Check persistent struggle
            cursor.execute(
                "SELECT score FROM submissions WHERE user_id = ? AND skill_name = ? ORDER BY submitted_at DESC LIMIT 3",
                (user_id, skill_name)
            )
            past_scores = [r["score"] for r in cursor.fetchall()]
            persistent_struggle = len(past_scores) >= 2 and all(s < 60 for s in past_scores)
            
            log_agent_activity(
                user_id=user_id,
                agent_name="Progress Engine",
                action_type="SKILL_SCORE_UPDATED",
                message=f"Updated {skill_name} proficiency from {old_score}% to {new_score}% (Status: {new_level})",
                details={
                    "skill": skill_name,
                    "previous_score": old_score,
                    "latest_assessment": assessment_score,
                    "updated_score": new_score,
                    "persistent_struggle": persistent_struggle,
                    "weakness_flagged": weakness
                },
                conn=conn
            )

            return {
                "skill_name": skill_name,
                "previous_score": old_score,
                "updated_score": new_score,
                "status": new_level,
                "persistent_struggle": persistent_struggle,
                "recent_scores": past_scores
            }

progress_engine = ProgressEngine()
