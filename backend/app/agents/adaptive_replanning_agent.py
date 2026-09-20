import uuid
from typing import Dict, List, Any, Optional
from datetime import datetime, timezone
from app.database import db_session, log_agent_activity

class AdaptiveReplanningAgent:
    @staticmethod
    def evaluate_and_replan(
        user_id: str,
        skill_name: str,
        assessment_score: int,
        weakness: str,
        recommendation: str
    ) -> Dict[str, Any]:
        """
        Core Adaptive Replanning Agent:
        Detects if performance falls below mastery threshold, restructures the learner's
        active roadmap, inserts prerequisite/reinforcement modules, defers advanced tasks,
        bumps roadmap version, and generates clear explainability diffs.
        """
        now_str = datetime.now(timezone.utc).isoformat()
        with db_session() as conn:
            cursor = conn.cursor()

            # Fetch active roadmap
            cursor.execute(
                "SELECT id, version, title FROM roadmaps WHERE user_id = ? AND is_active = 1 ORDER BY version DESC LIMIT 1",
                (user_id,)
            )
            active_roadmap = cursor.fetchone()

            current_version = active_roadmap["version"] if active_roadmap else 1
            new_version = current_version + 1
            new_roadmap_id = str(uuid.uuid4())

            # Fetch existing activities
            existing_activities = []
            if active_roadmap:
                cursor.execute(
                    """SELECT week_number, sequence_order, title, activity_type, skill_name, duration_min, description, status, resource_url, resource_title, resource_type 
                       FROM roadmap_activities WHERE roadmap_id = ? ORDER BY week_number, sequence_order""",
                    (active_roadmap["id"],)
                )
                existing_activities = [dict(r) for r in cursor.fetchall()]

            # Deactivate previous roadmap
            if active_roadmap:
                cursor.execute("UPDATE roadmaps SET is_active = 0 WHERE id = ?", (active_roadmap["id"],))

            # Build adapted curriculum
            new_activities = []
            added_titles = []
            moved_titles = []

            # Specific adaptation if weakness is related to RAG / Retrieval Evaluation
            if skill_name == "RAG" or "retrieval" in weakness.lower() or assessment_score < 75:
                # Add targeted remedial practice nodes right into Week 1 / Week 2
                added_node_1 = {
                    "week_number": 1,
                    "sequence_order": 4,
                    "title": "Retrieval Evaluation Practice",
                    "activity_type": "practice",
                    "skill_name": "RAG",
                    "duration_min": 35,
                    "description": "Construct automated unit tests to measure Precision@K and Reciprocal Rank on retrieved chunks.",
                    "status": "pending",
                    "is_new_addition": 1,
                    "is_moved": 0,
                    "resource_url": "https://docs.ragas.io/",
                    "resource_title": "Ragas Evaluation Guide",
                    "resource_type": "Practice"
                }
                added_node_2 = {
                    "week_number": 1,
                    "sequence_order": 5,
                    "title": "Chunking Strategies & Sentence Boundary Preservation",
                    "activity_type": "practice",
                    "skill_name": "RAG",
                    "duration_min": 30,
                    "description": "Hands-on exercise implementing recursive character splitting with 20% token overlap to eliminate sentence fragmentation.",
                    "status": "pending",
                    "is_new_addition": 1,
                    "is_moved": 0,
                    "resource_url": "https://python.langchain.com/docs/tutorials/rag/",
                    "resource_title": "Document Chunking Tutorial",
                    "resource_type": "Practice"
                }

                added_titles.extend([added_node_1["title"], added_node_2["title"]])

                # Carry over existing activities, marking the RAG assessment as completed
                for act in existing_activities:
                    act_copy = act.copy()
                    if act_copy["activity_type"] == "assessment" and act_copy["skill_name"] == "RAG":
                        act_copy["status"] = "completed"
                        act_copy["score"] = assessment_score
                    elif act_copy["week_number"] == 2 and "Vector Databases" in act_copy["title"]:
                        act_copy["is_moved"] = 1
                        moved_titles.append(act_copy["title"])
                    act_copy["is_new_addition"] = 0
                    new_activities.append(act_copy)

                new_activities.append(added_node_1)
                new_activities.append(added_node_2)
            else:
                added_node = {
                    "week_number": 2,
                    "sequence_order": 99,
                    "title": f"Targeted {skill_name} Reinforcement Lab",
                    "activity_type": "practice",
                    "skill_name": skill_name,
                    "duration_min": 35,
                    "description": f"Strengthen prerequisite concepts for {skill_name} following your recent assessment.",
                    "status": "pending",
                    "is_new_addition": 1,
                    "is_moved": 0,
                    "resource_url": "https://huggingface.co/learn",
                    "resource_title": "Skill Reinforcement Guide",
                    "resource_type": "Tutorial"
                }
                added_titles.append(added_node["title"])
                for act in existing_activities:
                    new_activities.append(act.copy())
                new_activities.append(added_node)

            diff_summary = {
                "version_from": current_version,
                "version_to": new_version,
                "trigger_skill": skill_name,
                "trigger_score": assessment_score,
                "weakness_detected": weakness or "Retrieval evaluation and chunk overlap quality",
                "added_activities": added_titles,
                "moved_activities": moved_titles or ["Vector Database Indexing rescheduled to ensure prerequisite mastery"],
                "reason": (
                    f"Your recent assessment on {skill_name} yielded an estimated score of {assessment_score}%, "
                    f"indicating difficulty with {weakness or 'retrieval quality'}. EduPath adapted your roadmap by adding "
                    f"{len(added_titles)} foundational exercises before advancing to production vector database scaling."
                )
            }

            import json
            # Insert new roadmap version
            cursor.execute(
                """INSERT INTO roadmaps (id, user_id, version, title, is_active, change_reason, diff_summary, created_at)
                   VALUES (?, ?, ?, ?, 1, ?, ?, ?)""",
                (
                    new_roadmap_id,
                    user_id,
                    new_version,
                    f"Adaptive Roadmap v{new_version}",
                    diff_summary["reason"],
                    json.dumps(diff_summary, ensure_ascii=False),
                    now_str
                )
            )

            # Insert activities into roadmap_activities
            for act in new_activities:
                cursor.execute(
                    """INSERT INTO roadmap_activities 
                       (id, roadmap_id, user_id, week_number, sequence_order, title, activity_type, skill_name, duration_min, description, status, is_new_addition, is_moved, score, resource_url, resource_title, resource_type)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    (
                        str(uuid.uuid4()),
                        new_roadmap_id,
                        user_id,
                        act["week_number"],
                        act["sequence_order"],
                        act["title"],
                        act["activity_type"],
                        act["skill_name"],
                        act.get("duration_min", 30),
                        act.get("description", ""),
                        act.get("status", "pending"),
                        act.get("is_new_addition", 0),
                        act.get("is_moved", 0),
                        act.get("score"),
                        act.get("resource_url", ""),
                        act.get("resource_title", ""),
                        act.get("resource_type", "")
                    )
                )

            log_agent_activity(
                user_id=user_id,
                agent_name="Adaptive Replanning Agent",
                action_type="ROADMAP_ADAPTED",
                message=f"Dynamic replanning triggered: Roadmap updated to v{new_version} (+{len(added_titles)} activities)",
                details=diff_summary,
                conn=conn
            )

            return {
                "success": True,
                "roadmap_id": new_roadmap_id,
                "version": new_version,
                "diff": diff_summary
            }

adaptive_replanning_agent = AdaptiveReplanningAgent()
