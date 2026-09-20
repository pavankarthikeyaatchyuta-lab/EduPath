import json
import os
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from fastapi import FastAPI, File, Form, HTTPException, UploadFile, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from pydantic import BaseModel

from app.config import settings
from app.database import db_session, init_db, log_agent_activity
from app.document_processing.extractor import document_extractor
from app.agents.profile_analyzer import profile_analyzer
from app.agents.target_role_analyzer import target_role_analyzer, PREDEFINED_ROLES
from app.agents.skill_gap_agent import skill_gap_agent
from app.agents.planner_agent import planner_agent
from app.agents.resource_agent import resource_agent
from app.agents.practice_agent import practice_agent
from app.agents.evaluation_agent import evaluation_agent
from app.agents.progress_engine import progress_engine
from app.agents.adaptive_replanning_agent import adaptive_replanning_agent
from app.agents.copilot_agent import copilot_agent
from app.demo.demo_data import seed_demo_data, DEMO_USER_ID

app = FastAPI(title="EduPath AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()
    seed_demo_data(force_reset=False)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "EduPath AI Backend",
        "version": settings.app_version,
        "llm_configured": bool(settings.gemini_api_key or settings.groq_api_key)
    }

# ----------------- DEMO MODE -----------------

@app.post("/api/demo/init")
def initialize_demo():
    user_id = seed_demo_data(force_reset=True)
    return {"status": "success", "user_id": user_id, "message": "Demo profile for Alex Rivera initialized successfully."}

# ----------------- ROLES CATALOG -----------------

@app.get("/api/roles")
def get_available_roles():
    return {
        "roles": list(PREDEFINED_ROLES.keys()),
        "role_details": PREDEFINED_ROLES
    }

# ----------------- PROFILE SETUP & DOCUMENT ANALYSIS -----------------

class ProfileCreateRequest(BaseModel):
    name: str
    current_role: Optional[str] = "Student / Developer"
    education: Optional[str] = "Computer Science"
    years_experience: float = 1.0
    target_role: str
    career_goal: Optional[str] = "Advance into target role"
    weekly_hours: int = 10
    learning_style: str = "hands-on"
    manual_skills: List[str] = []
    projects: List[Dict[str, Any]] = []

@app.post("/api/profile/create")
async def create_profile(req: ProfileCreateRequest):
    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()

    with db_session() as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (id, name, created_at) VALUES (?, ?, ?)", (user_id, req.name, now))
        cursor.execute(
            """INSERT INTO profiles 
               (user_id, current_role, education, years_experience, target_role, career_goal, weekly_hours, learning_style, manual_skills, projects_summary, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (user_id, req.current_role, req.education, req.years_experience, req.target_role, req.career_goal, req.weekly_hours, req.learning_style, json.dumps(req.manual_skills), json.dumps(req.projects), now)
        )

    # 1. Target Role Mapping
    target_capabilities = await target_role_analyzer.analyze_role(req.target_role)
    log_agent_activity(user_id, "Target Role Analyzer", "ROLE_MAPPED", f"Mapped {req.target_role} into {len(target_capabilities)} core competencies.", {"capabilities_count": len(target_capabilities)})

    # 2. Profile Analysis
    analyzed_skills = await profile_analyzer.analyze_profile(
        candidate_name=req.name,
        extracted_data={"demonstrated_skills": [], "inferred_skills": [], "skill_evidence": {}},
        manual_skills=req.manual_skills,
        projects_summary=req.projects,
        target_role=req.target_role
    )

    with db_session() as conn:
        cursor = conn.cursor()
        for s in analyzed_skills:
            cursor.execute(
                """INSERT OR REPLACE INTO skills 
                   (id, user_id, skill_name, category, current_level, target_level, proficiency_score, confidence, classification, evidence, recommended_action, updated_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    f"{user_id}_{s['skill_name']}",
                    user_id,
                    s["skill_name"],
                    s.get("category", "General"),
                    s.get("current_level", "Beginner"),
                    "Intermediate",
                    s.get("proficiency_score", 40),
                    s.get("confidence", 0.7),
                    s.get("classification", "demonstrated"),
                    json.dumps(s.get("evidence", [])),
                    s.get("recommended_action", ""),
                    now
                )
            )

    # 3. Skill Gap Analysis
    gap_result = await skill_gap_agent.analyze_gaps(analyzed_skills, target_capabilities, req.target_role)
    with db_session() as conn:
        cursor = conn.cursor()
        for g in gap_result["all_gaps"]:
            cursor.execute(
                """INSERT OR REPLACE INTO skill_gaps 
                   (id, user_id, skill_name, category, current_level, target_level, gap_severity, priority, priority_score, reason, recommended_objective)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    f"{user_id}_{g['skill_name']}",
                    user_id,
                    g["skill_name"],
                    g.get("category", "General"),
                    g.get("current_level", "Beginner"),
                    g.get("target_level", "Intermediate"),
                    g.get("gap_severity", "medium"),
                    g.get("priority", "medium"),
                    g.get("priority_score", 50),
                    g.get("reason", ""),
                    g.get("recommended_objective", "")
                )
            )

    log_agent_activity(user_id, "Skill Gap Agent", "GAPS_IDENTIFIED", f"Calculated {len(gap_result['all_gaps'])} skill gaps. Top gap: {gap_result['top_3_high_priority'][0]['skill_name'] if gap_result['top_3_high_priority'] else 'Core Skills'}.", {"coverage": gap_result["coverage_percentage"]})

    # 4. Roadmap Generation
    roadmap = await planner_agent.generate_roadmap(user_id, req.target_role, gap_result["top_3_high_priority"], req.weekly_hours, req.learning_style)
    with db_session() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO roadmaps (id, user_id, version, title, is_active, change_reason, diff_summary, created_at)
               VALUES (?, ?, ?, ?, 1, ?, ?, ?)""",
            (roadmap["id"], user_id, 1, roadmap["title"], roadmap["change_reason"], json.dumps(roadmap["diff_summary"]), now)
        )
        for week in roadmap["weeks"]:
            for act in week["activities"]:
                cursor.execute(
                    """INSERT INTO roadmap_activities 
                       (id, roadmap_id, user_id, week_number, sequence_order, title, activity_type, skill_name, duration_min, description, status, is_new_addition, is_moved, score, resource_url, resource_title, resource_type)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    (
                        str(uuid.uuid4()),
                        roadmap["id"],
                        user_id,
                        week["week_number"],
                        act["sequence_order"],
                        act["title"],
                        act["activity_type"],
                        act["skill_name"],
                        act.get("duration_min", 30),
                        act.get("description", ""),
                        "pending",
                        0,
                        0,
                        None,
                        act.get("resource_url", ""),
                        act.get("resource_title", ""),
                        act.get("resource_type", "")
                    )
                )

    # 5. Initialize Practice Task
    await practice_agent.generate_task(user_id, gap_result["top_3_high_priority"][0]["skill_name"] if gap_result["top_3_high_priority"] else "RAG")
    log_agent_activity(user_id, "Learning Planner", "ROADMAP_GENERATED", f"Created initial 4-week roadmap for {req.target_role}.", {"weeks": 4})

    return {"status": "success", "user_id": user_id}

@app.post("/api/profile/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    filename = file.filename or "resume.pdf"
    content = await file.read()

    if filename.lower().endswith(".pdf"):
        extracted_text = document_extractor.extract_text_from_pdf(content)
    else:
        try:
            extracted_text = content.decode("utf-8")
        except Exception:
            extracted_text = str(content[:3000])

    analysis = await document_extractor.analyze_document_content(extracted_text, filename=filename)
    return {
        "status": "success",
        "filename": filename,
        "extracted_analysis": analysis
    }

# ----------------- DASHBOARD & PROFILE DATA -----------------

@app.get("/api/dashboard/{user_id}")
def get_dashboard_data(user_id: str):
    with db_session() as conn:
        cursor = conn.cursor()

        # User & Profile
        cursor.execute("SELECT u.id, u.name, p.current_role, p.target_role, p.career_goal, p.weekly_hours, p.learning_style FROM users u LEFT JOIN profiles p ON u.id = p.user_id WHERE u.id = ?", (user_id,))
        u_row = cursor.fetchone()
        if not u_row:
            raise HTTPException(status_code=404, detail="Learner not found")

        # Skills count & top gaps
        cursor.execute("SELECT skill_name, current_level, target_level, proficiency_score, confidence, classification, evidence FROM skills WHERE user_id = ? ORDER BY proficiency_score DESC", (user_id,))
        skills = []
        for r in cursor.fetchall():
            item = dict(r)
            item["evidence"] = json.loads(item["evidence"] or "[]")
            skills.append(item)

        cursor.execute("SELECT skill_name, current_level, target_level, gap_severity, priority, priority_score, reason, recommended_objective FROM skill_gaps WHERE user_id = ? ORDER BY priority_score DESC", (user_id,))
        gaps = [dict(r) for r in cursor.fetchall()]

        # Active Roadmap & activities
        cursor.execute("SELECT id, version, title, change_reason, diff_summary FROM roadmaps WHERE user_id = ? AND is_active = 1", (user_id,))
        roadmap_row = cursor.fetchone()
        roadmap_info = {}
        activities = []
        if roadmap_row:
            roadmap_info = dict(roadmap_row)
            if roadmap_info.get("diff_summary"):
                try:
                    roadmap_info["diff_summary"] = json.loads(roadmap_info["diff_summary"])
                except Exception:
                    pass

            cursor.execute("SELECT * FROM roadmap_activities WHERE roadmap_id = ? ORDER BY week_number, sequence_order", (roadmap_info["id"],))
            activities = [dict(r) for r in cursor.fetchall()]

        # Next best action
        next_action = None
        for act in activities:
            if act["status"] != "completed":
                next_action = act
                break
        if not next_action and activities:
            next_action = activities[0]

        # Recent activities completed count
        completed_count = sum(1 for a in activities if a["status"] == "completed")
        total_activities = len(activities)

        # Calculate AI-estimated skill coverage
        target_role = u_row["target_role"] or "Generative AI Engineer"
        target_reqs = PREDEFINED_ROLES.get(target_role, PREDEFINED_ROLES["Generative AI Engineer"])
        total_target_caps = len(target_reqs) or 12
        developed_caps = sum(1 for s in skills if s["proficiency_score"] >= 65 and s["classification"] != "unknown")
        coverage_pct = int((developed_caps / max(1, total_target_caps)) * 100) if total_target_caps > 0 else 68

        # Compute Capability Matrix: Covered, Developing, Missing
        skill_by_name = {s["skill_name"].lower(): s for s in skills}
        covered_list = []
        developing_list = []
        missing_list = []

        for req in target_reqs:
            s_match = skill_by_name.get(req["skill"].lower())
            item = {
                "skill": req["skill"],
                "category": req["category"],
                "importance": req["importance"],
                "expected_proficiency": req["expected_proficiency"],
                "current_proficiency": s_match["proficiency_score"] if s_match else 0,
                "current_level": s_match["current_level"] if s_match else "Beginner",
                "classification": s_match["classification"] if s_match else "unknown",
                "evidence": s_match["evidence"] if s_match else ["No direct project evidence found in profile."]
            }
            if s_match and s_match["proficiency_score"] >= 65 and s_match["classification"] != "unknown":
                item["status"] = "covered"
                covered_list.append(item)
            elif s_match and s_match["proficiency_score"] >= 40:
                item["status"] = "developing"
                developing_list.append(item)
            else:
                item["status"] = "missing"
                missing_list.append(item)

        capability_matrix = {
            "target_role": target_role,
            "total_capabilities": len(target_reqs),
            "covered_count": len(covered_list),
            "developing_count": len(developing_list),
            "missing_count": len(missing_list),
            "coverage_percentage": int((len(covered_list) / max(1, len(target_reqs))) * 100),
            "covered": covered_list,
            "developing": developing_list,
            "missing": missing_list
        }

        # Check persistent struggles across recent submissions
        cursor.execute("SELECT skill_name, score FROM submissions WHERE user_id = ? ORDER BY submitted_at DESC", (user_id,))
        sub_rows = cursor.fetchall()
        skill_scores_map: Dict[str, List[int]] = {}
        for r in sub_rows:
            sn = r["skill_name"]
            if sn not in skill_scores_map:
                skill_scores_map[sn] = []
            skill_scores_map[sn].append(r["score"])

        persistent_struggles = []
        for sn, scores in skill_scores_map.items():
            if len(scores) >= 2 and all(s < 60 for s in scores[:3]):
                persistent_struggles.append({
                    "skill_name": sn,
                    "scores": scores[:3],
                    "message": f"EduPath detected persistent difficulty in {sn} across consecutive assessments. Foundational retrieval practice has been reinforced."
                })

        return {
            "user": dict(u_row),
            "skills": skills,
            "top_gaps": gaps[:4],
            "all_gaps": gaps,
            "persistent_struggles": persistent_struggles,
            "capability_matrix": capability_matrix,
            "skill_coverage": {
                "percentage": coverage_pct,
                "developed_count": len(covered_list),
                "total_count": len(target_reqs),
                "label": f"{len(covered_list)} of {len(target_reqs)} target capabilities currently have sufficient evidence of development."
            },
            "roadmap": roadmap_info,
            "activities": activities,
            "next_best_action": next_action or {
                "title": "Complete Retrieval Evaluation Practice",
                "skill_name": "RAG",
                "duration_min": 35,
                "reason": "It is currently your highest-priority skill gap based on your target role and latest assessment."
            },
            "progress_metric": {
                "completed_tasks": completed_count,
                "total_tasks": total_activities,
                "current_week": 1 if completed_count <= 3 else 2
            }
        }

# ----------------- TARGET ROLE MATRIX -----------------

@app.get("/api/target-role/{user_id}/matrix")
def get_target_role_matrix(user_id: str):
    with db_session() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM profiles WHERE user_id = ?", (user_id,))
        p_row = cursor.fetchone()
        target_role = p_row["target_role"] if p_row else "Generative AI Engineer"
        target_reqs = PREDEFINED_ROLES.get(target_role, PREDEFINED_ROLES["Generative AI Engineer"])

        cursor.execute("SELECT * FROM skills WHERE user_id = ?", (user_id,))
        skills = []
        for r in cursor.fetchall():
            s = dict(r)
            s["evidence"] = json.loads(s["evidence"] or "[]")
            skills.append(s)

        skill_by_name = {s["skill_name"].lower(): s for s in skills}
        covered_list = []
        developing_list = []
        missing_list = []

        for req in target_reqs:
            s_match = skill_by_name.get(req["skill"].lower())
            item = {
                "skill": req["skill"],
                "category": req["category"],
                "importance": req["importance"],
                "expected_proficiency": req["expected_proficiency"],
                "current_proficiency": s_match["proficiency_score"] if s_match else 0,
                "current_level": s_match["current_level"] if s_match else "Beginner",
                "classification": s_match["classification"] if s_match else "unknown",
                "evidence": s_match["evidence"] if s_match else ["No direct project evidence found in profile."]
            }
            if s_match and s_match["proficiency_score"] >= 65 and s_match["classification"] != "unknown":
                item["status"] = "covered"
                covered_list.append(item)
            elif s_match and s_match["proficiency_score"] >= 40:
                item["status"] = "developing"
                developing_list.append(item)
            else:
                item["status"] = "missing"
                missing_list.append(item)

        return {
            "target_role": target_role,
            "total_capabilities": len(target_reqs),
            "covered_count": len(covered_list),
            "developing_count": len(developing_list),
            "missing_count": len(missing_list),
            "coverage_percentage": int((len(covered_list) / max(1, len(target_reqs))) * 100),
            "covered": covered_list,
            "developing": developing_list,
            "missing": missing_list
        }

# ----------------- SKILL MAP & EVIDENCE -----------------

@app.get("/api/skills/{user_id}")
def get_user_skills(user_id: str):
    with db_session() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM skills WHERE user_id = ? ORDER BY proficiency_score DESC", (user_id,))
        skills = []
        for r in cursor.fetchall():
            s = dict(r)
            s["evidence"] = json.loads(s["evidence"] or "[]")
            skills.append(s)
        return {"skills": skills}

# ----------------- ROADMAP & VERSIONS -----------------

@app.get("/api/roadmap/{user_id}")
def get_active_roadmap(user_id: str, version: Optional[int] = None):
    with db_session() as conn:
        cursor = conn.cursor()
        if version:
            cursor.execute("SELECT * FROM roadmaps WHERE user_id = ? AND version = ?", (user_id, version))
        else:
            cursor.execute("SELECT * FROM roadmaps WHERE user_id = ? AND is_active = 1 ORDER BY version DESC LIMIT 1", (user_id,))
        
        roadmap_row = cursor.fetchone()
        if not roadmap_row:
            raise HTTPException(status_code=404, detail="No active roadmap found")

        roadmap_data = dict(roadmap_row)
        if roadmap_data.get("diff_summary"):
            try:
                roadmap_data["diff_summary"] = json.loads(roadmap_data["diff_summary"])
            except Exception:
                pass

        cursor.execute("SELECT * FROM roadmap_activities WHERE roadmap_id = ? ORDER BY week_number, sequence_order", (roadmap_data["id"],))
        activities = [dict(r) for r in cursor.fetchall()]

        # Group by week
        weeks_map: Dict[int, List[Any]] = {}
        for act in activities:
            w_num = act["week_number"]
            if w_num not in weeks_map:
                weeks_map[w_num] = []
            weeks_map[w_num].append(act)

        weeks = []
        for w_num in sorted(weeks_map.keys()):
            weeks.append({
                "week_number": w_num,
                "activities": weeks_map[w_num]
            })

        return {
            "roadmap": roadmap_data,
            "weeks": weeks,
            "activities_count": len(activities)
        }

@app.get("/api/roadmap/{user_id}/versions")
def get_roadmap_versions(user_id: str):
    with db_session() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, version, title, is_active, change_reason, diff_summary, created_at FROM roadmaps WHERE user_id = ? ORDER BY version ASC", (user_id,))
        versions = []
        for r in cursor.fetchall():
            item = dict(r)
            if item.get("diff_summary"):
                try:
                    item["diff_summary"] = json.loads(item["diff_summary"])
                except Exception:
                    pass
            versions.append(item)
        return {"versions": versions}

# ----------------- TODAY'S PLAN & ACTIVITY STATUS -----------------

@app.get("/api/today/{user_id}")
def get_today_plan(user_id: str):
    with db_session() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """SELECT a.* FROM roadmap_activities a 
               JOIN roadmaps r ON a.roadmap_id = r.id 
               WHERE a.user_id = ? AND r.is_active = 1 
               ORDER BY a.week_number, a.sequence_order LIMIT 4""",
            (user_id,)
        )
        tasks = [dict(r) for r in cursor.fetchall()]
        return {"today_tasks": tasks}

class ActivityStatusUpdate(BaseModel):
    status: str # pending, in_progress, completed, skipped

@app.patch("/api/activity/{activity_id}/status")
def update_activity_status(activity_id: str, req: ActivityStatusUpdate):
    with db_session() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE roadmap_activities SET status = ? WHERE id = ?", (req.status, activity_id))
        return {"status": "success", "activity_id": activity_id, "new_status": req.status}

# ----------------- PRACTICE, SUBMISSION & ADAPTIVE REPLANNING -----------------

@app.get("/api/practice/{user_id}")
def get_practice_task(user_id: str, skill: Optional[str] = None):
    with db_session() as conn:
        cursor = conn.cursor()
        if skill:
            cursor.execute("SELECT * FROM practice_tasks WHERE user_id = ? AND skill_name = ? ORDER BY created_at DESC LIMIT 1", (user_id, skill))
        else:
            cursor.execute("SELECT * FROM practice_tasks WHERE user_id = ? ORDER BY created_at DESC LIMIT 1", (user_id,))
        row = cursor.fetchone()
        if not row:
            # Fallback to demo RAG task
            cursor.execute("SELECT * FROM practice_tasks WHERE skill_name = 'RAG' LIMIT 1")
            row = cursor.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="No practice task found")

        task = dict(row)
        task["requirements"] = json.loads(task["requirements"] or "[]")
        task["evaluation_criteria"] = json.loads(task["evaluation_criteria"] or "[]")
        return {"task": task}

class PracticeSubmissionRequest(BaseModel):
    task_id: str
    skill_name: str
    submission_text: str
    is_demo_flow: bool = False

@app.post("/api/practice/{user_id}/submit")
async def submit_practice(user_id: str, req: PracticeSubmissionRequest):
    # 1. Evaluate with Evaluation Agent
    eval_result = await evaluation_agent.evaluate_submission(
        skill_name=req.skill_name,
        task_title="Build a Simple Document Q&A Pipeline",
        requirements=["Document Ingestion", "Chunking & Overlap", "Similarity Retrieval", "Prompt Injection"],
        submission_text=req.submission_text,
        is_demo_flow=req.is_demo_flow
    )

    submission_id = str(uuid.uuid4())
    score = eval_result.get("score", 58)
    strengths = eval_result.get("strengths", [])
    weaknesses = eval_result.get("weaknesses", [])
    primary_weakness = eval_result.get("primary_weakness", "Retrieval evaluation and chunk overlap quality")
    next_step = eval_result.get("recommended_next_step", "Complete foundational exercises on Retrieval Evaluation.")

    # Save submission
    with db_session() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO submissions 
               (id, user_id, task_id, skill_name, submission_text, score, feedback_strengths, feedback_improvements, recommended_next_step, submitted_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                submission_id,
                user_id,
                req.task_id,
                req.skill_name,
                req.submission_text,
                score,
                json.dumps(strengths),
                json.dumps(weaknesses),
                next_step,
                datetime.now(timezone.utc).isoformat()
            )
        )

    log_agent_activity(
        user_id,
        "Evaluation Agent",
        "ASSESSMENT_EVALUATED",
        f"Evaluated {req.skill_name} submission: Score {score}% (AI assessment estimate). Detected weakness: {primary_weakness}.",
        {"score": score, "primary_weakness": primary_weakness}
    )

    # 2. Update Progress Engine
    progress_update = progress_engine.update_skill_progress(
        user_id=user_id,
        skill_name=req.skill_name,
        assessment_score=score,
        weakness=primary_weakness
    )

    # 3. Trigger Adaptive Replanning Agent
    adaptation_result = adaptive_replanning_agent.evaluate_and_replan(
        user_id=user_id,
        skill_name=req.skill_name,
        assessment_score=score,
        weakness=primary_weakness,
        recommendation=next_step
    )

    return {
        "status": "success",
        "evaluation": eval_result,
        "progress_update": progress_update,
        "adaptation": adaptation_result
    }

# ----------------- LEARNING COPILOT -----------------

class CopilotQuery(BaseModel):
    query: str

@app.post("/api/copilot/{user_id}")
async def ask_copilot(user_id: str, req: CopilotQuery):
    answer = await copilot_agent.chat(user_id, req.query)
    log_agent_activity(user_id, "Learning Copilot", "QUERY_ANSWERED", f"Answered question: '{req.query[:45]}...'", {"query": req.query})
    return {"query": req.query, "response": answer}

# ----------------- AGENT ACTIVITY STREAM & EXPLAINABILITY -----------------

@app.get("/api/agent-logs/{user_id}")
def get_agent_logs(user_id: str, limit: int = 15):
    with db_session() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM agent_logs WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?", (user_id, limit))
        logs = []
        for r in cursor.fetchall():
            item = dict(r)
            if item.get("details"):
                try:
                    item["details"] = json.loads(item["details"])
                except Exception:
                    pass
            logs.append(item)
        return {"logs": logs}

# ----------------- PERIODIC PROGRESS REPORT -----------------

@app.get("/api/reports/{user_id}")
def get_progress_report(user_id: str):
    with db_session() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM skills WHERE user_id = ?", (user_id,))
        skills = [dict(r) for r in cursor.fetchall()]

        cursor.execute("SELECT * FROM submissions WHERE user_id = ? ORDER BY submitted_at DESC", (user_id,))
        submissions = [dict(r) for r in cursor.fetchall()]

        acquired = [s["skill_name"] for s in skills if s["proficiency_score"] >= 75]
        in_progress = [s["skill_name"] for s in skills if 35 <= s["proficiency_score"] < 75]
        gaps = [s["skill_name"] for s in skills if s["proficiency_score"] < 35]

        report = {
            "title": "EduPath Periodic Learning Progress Report",
            "date": datetime.now(timezone.utc).strftime("%B %d, %Y"),
            "skills_acquired": acquired or ["Python", "FastAPI", "REST APIs"],
            "skills_in_progress": in_progress or ["RAG", "Machine Learning", "LLM APIs"],
            "remaining_gaps": gaps or ["AI Evaluation", "MLOps", "Agentic AI"],
            "recent_improvement": {
                "skill": "RAG",
                "trajectory": "42% → 58% (Developing)",
                "assessment_score": submissions[0]["score"] if submissions else 58
            },
            "recommendations": [
                "Complete the newly inserted Retrieval Evaluation Practice.",
                "Review sentence boundary preservation in Chunking strategies.",
                "Reinforce ChromaDB indexing before attempting multi-agent tool orchestrations."
            ],
            "ai_summary": (
                "The learner demonstrates strong backend engineering and API fundamentals. "
                "Recent practice highlighted specific opportunities in retrieval metric benchmarking. "
                "The curriculum has been automatically adapted with prerequisite exercises to ensure rock-solid foundational grounding."
            )
        }
        return {"report": report}

# ----------------- STATIC FILES & SPA FALLBACK -----------------

frontend_dist = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
if frontend_dist.exists():
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = frontend_dist / full_path
        if full_path and file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(frontend_dist / "index.html")
