import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_full_e2e_product_flow():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # 1. Health check
        res = await ac.get("/api/health")
        assert res.status_code == 200
        assert res.json()["service"] == "EduPath AI Backend"

        # 2. Initialize Demo
        res = await ac.post("/api/demo/init")
        assert res.status_code == 200
        user_id = res.json()["user_id"]
        assert user_id == "demo_alex_rivera"

        # 3. Fetch Dashboard
        res = await ac.get(f"/api/dashboard/{user_id}")
        assert res.status_code == 200
        d_data = res.json()
        assert d_data["user"]["name"] == "Alex Rivera"
        assert d_data["skill_coverage"]["percentage"] == 68
        assert d_data["top_gaps"][0]["skill_name"] == "RAG"
        assert len(d_data["skills"]) >= 8

        # 4. Fetch Skills & Evidence
        res = await ac.get(f"/api/skills/{user_id}")
        assert res.status_code == 200
        skills = res.json()["skills"]
        python_skill = next(s for s in skills if s["skill_name"] == "Python")
        assert python_skill["classification"] == "demonstrated"
        assert len(python_skill["evidence"]) > 0

        # 5. Fetch Initial Roadmap (Version 1)
        res = await ac.get(f"/api/roadmap/{user_id}")
        assert res.status_code == 200
        r_data = res.json()
        assert r_data["roadmap"]["version"] == 1
        assert len(r_data["weeks"]) == 4

        # 6. Fetch Practice Task
        res = await ac.get(f"/api/practice/{user_id}")
        assert res.status_code == 200
        task_data = res.json()["task"]
        assert task_data["skill_name"] == "RAG"

        # 7. Submit Practice Task (triggers Adaptive Replanning!)
        submit_payload = {
            "task_id": task_data["id"],
            "skill_name": "RAG",
            "submission_text": "class SimpleRAG: pass",
            "is_demo_flow": True
        }
        res = await ac.post(f"/api/practice/{user_id}/submit", json=submit_payload)
        assert res.status_code == 200
        eval_body = res.json()
        assert eval_body["evaluation"]["score"] == 58
        assert "Retrieval evaluation" in eval_body["evaluation"]["weaknesses"][0]
        assert eval_body["adaptation"]["version"] == 2
        assert len(eval_body["adaptation"]["diff"]["added_activities"]) == 2

        # 8. Verify Adapted Roadmap (Version 2)
        res = await ac.get(f"/api/roadmap/{user_id}")
        assert res.status_code == 200
        r_v2 = res.json()
        assert r_v2["roadmap"]["version"] == 2
        # Check added activities exist in activities
        week1_acts = [a["title"] for a in r_v2["weeks"][0]["activities"]]
        assert "Retrieval Evaluation Practice" in week1_acts
        assert "Chunking Strategies & Sentence Boundary Preservation" in week1_acts

        # 9. Verify Version History (v1 and v2)
        res = await ac.get(f"/api/roadmap/{user_id}/versions")
        assert res.status_code == 200
        versions = res.json()["versions"]
        assert len(versions) >= 2
        assert versions[0]["version"] == 1
        assert versions[1]["version"] == 2

        # 10. Copilot Grounded Query
        copilot_payload = {"query": "Why did my roadmap change?"}
        res = await ac.post(f"/api/copilot/{user_id}", json=copilot_payload)
        assert res.status_code == 200
        copilot_answer = res.json()["response"]
        assert "58%" in copilot_answer or "retrieval" in copilot_answer.lower()
        assert "Retrieval Evaluation" in copilot_answer

        # 11. Progress Report
        res = await ac.get(f"/api/reports/{user_id}")
        assert res.status_code == 200
        report = res.json()["report"]
        assert "Python" in report["skills_acquired"]
        assert "RAG" in report["recent_improvement"]["skill"]

        # 12. Frontend SPA index.html Serving
        res = await ac.get("/")
        assert res.status_code == 200
        assert "<div id=\"root\">" in res.text or "<!doctype html>" in res.text.lower()
