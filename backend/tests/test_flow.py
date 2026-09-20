import pytest
from app.database import init_db
from app.demo.demo_data import seed_demo_data, DEMO_USER_ID
from app.agents.target_role_analyzer import target_role_analyzer
from app.agents.skill_gap_agent import skill_gap_agent
from app.agents.evaluation_agent import evaluation_agent
from app.agents.progress_engine import progress_engine
from app.agents.adaptive_replanning_agent import adaptive_replanning_agent

@pytest.fixture(autouse=True)
def setup_database():
    init_db()
    seed_demo_data(force_reset=True)

@pytest.mark.asyncio
async def test_target_role_mapping():
    capabilities = await target_role_analyzer.analyze_role("Generative AI Engineer")
    assert len(capabilities) >= 10
    skill_names = [c["skill"] for c in capabilities]
    assert "Python" in skill_names
    assert "RAG" in skill_names
    assert "AI Evaluation" in skill_names

@pytest.mark.asyncio
async def test_skill_gap_analysis():
    learner_skills = [
        {"skill_name": "Python", "proficiency_score": 90, "current_level": "Advanced", "classification": "demonstrated", "evidence": ["Built REST APIs"]},
        {"skill_name": "RAG", "proficiency_score": 42, "current_level": "Beginner", "classification": "unknown", "evidence": []}
    ]
    target_caps = [
        {"skill": "Python", "expected_proficiency": 85, "importance": "Critical"},
        {"skill": "RAG", "expected_proficiency": 85, "importance": "Critical"}
    ]
    res = await skill_gap_agent.analyze_gaps(learner_skills, target_caps, "Generative AI Engineer")
    assert len(res["all_gaps"]) >= 1
    rag_gap = [g for g in res["all_gaps"] if g["skill_name"] == "RAG"][0]
    assert rag_gap["priority"] == "high"

@pytest.mark.asyncio
async def test_evaluation_and_adaptive_replan():
    # 1. Evaluate demo answer
    eval_res = await evaluation_agent.evaluate_submission(
        skill_name="RAG",
        task_title="Build a Simple Document Q&A Pipeline",
        requirements=["Chunking", "Retrieval"],
        submission_text="class SimpleRAG: pass",
        is_demo_flow=True
    )
    assert eval_res["score"] == 58
    assert "Retrieval evaluation" in eval_res["weaknesses"][0]

    # 2. Progress update
    prog_res = progress_engine.update_skill_progress(
        user_id=DEMO_USER_ID,
        skill_name="RAG",
        assessment_score=58,
        weakness=eval_res["primary_weakness"]
    )
    assert prog_res["updated_score"] >= 40

    # 3. Adaptive replan
    replan_res = adaptive_replanning_agent.evaluate_and_replan(
        user_id=DEMO_USER_ID,
        skill_name="RAG",
        assessment_score=58,
        weakness=eval_res["primary_weakness"],
        recommendation=eval_res["recommended_next_step"]
    )
    assert replan_res["version"] == 2
    assert len(replan_res["diff"]["added_activities"]) == 2
    assert "Retrieval Evaluation Practice" in replan_res["diff"]["added_activities"][0]
