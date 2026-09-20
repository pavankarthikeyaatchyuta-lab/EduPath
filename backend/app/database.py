import sqlite3
import json
from contextlib import contextmanager
from datetime import datetime, timezone
from typing import Generator, Any, Dict, List, Optional
from app.config import settings

def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(settings.db_path, check_same_thread=False, timeout=30.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA busy_timeout = 30000;")
    return conn

@contextmanager
def db_session() -> Generator[sqlite3.Connection, None, None]:
    conn = get_db_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def init_db():
    with db_session() as conn:
        cursor = conn.cursor()
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS profiles (
            user_id TEXT PRIMARY KEY,
            current_role TEXT,
            education TEXT,
            years_experience REAL DEFAULT 0,
            target_role TEXT NOT NULL,
            career_goal TEXT,
            weekly_hours INTEGER DEFAULT 10,
            learning_style TEXT DEFAULT 'hands-on',
            resume_filename TEXT,
            manual_skills TEXT, -- JSON array
            projects_summary TEXT, -- JSON array
            raw_extracted_data TEXT, -- JSON object
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS skills (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            skill_name TEXT NOT NULL,
            category TEXT,
            current_level TEXT, -- Beginner, Intermediate, Advanced, Expert
            target_level TEXT,
            proficiency_score INTEGER DEFAULT 0, -- 0 to 100
            confidence REAL DEFAULT 0.5, -- 0.0 to 1.0
            classification TEXT DEFAULT 'demonstrated', -- demonstrated, inferred, unknown
            evidence TEXT, -- JSON array of strings/details
            recommended_action TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS skill_gaps (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            skill_name TEXT NOT NULL,
            category TEXT,
            current_level TEXT,
            target_level TEXT,
            gap_severity TEXT, -- high, medium, low
            priority TEXT, -- high, medium, low
            priority_score INTEGER DEFAULT 50,
            reason TEXT,
            recommended_objective TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS roadmaps (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            version INTEGER NOT NULL DEFAULT 1,
            title TEXT,
            is_active BOOLEAN DEFAULT 1,
            change_reason TEXT,
            diff_summary TEXT, -- JSON object describing additions, removals, reorders
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS roadmap_activities (
            id TEXT PRIMARY KEY,
            roadmap_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            week_number INTEGER NOT NULL,
            sequence_order INTEGER NOT NULL,
            title TEXT NOT NULL,
            activity_type TEXT NOT NULL, -- learn, practice, assessment, project
            skill_name TEXT NOT NULL,
            duration_min INTEGER DEFAULT 30,
            description TEXT,
            status TEXT DEFAULT 'pending', -- pending, in_progress, completed, skipped
            is_new_addition BOOLEAN DEFAULT 0,
            is_moved BOOLEAN DEFAULT 0,
            score INTEGER,
            resource_url TEXT,
            resource_title TEXT,
            resource_type TEXT,
            FOREIGN KEY(roadmap_id) REFERENCES roadmaps(id),
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS practice_tasks (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            skill_name TEXT NOT NULL,
            task_title TEXT NOT NULL,
            practice_type TEXT DEFAULT 'coding',
            objective TEXT,
            requirements TEXT, -- JSON array
            evaluation_criteria TEXT, -- JSON array
            initial_code_template TEXT,
            difficulty TEXT DEFAULT 'Intermediate',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS submissions (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            task_id TEXT NOT NULL,
            skill_name TEXT NOT NULL,
            submission_text TEXT NOT NULL,
            score INTEGER NOT NULL,
            feedback_strengths TEXT, -- JSON array
            feedback_improvements TEXT, -- JSON array
            recommended_next_step TEXT,
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS agent_logs (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            agent_name TEXT NOT NULL,
            action_type TEXT NOT NULL,
            message TEXT NOT NULL,
            details TEXT, -- JSON object
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS progress_reports (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            title TEXT NOT NULL,
            generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            report_content TEXT NOT NULL, -- JSON object
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
        """)

def log_agent_activity(user_id: str, agent_name: str, action_type: str, message: str, details: Optional[Dict[str, Any]] = None, conn: Optional[sqlite3.Connection] = None):
    import uuid
    now_str = datetime.now(timezone.utc).isoformat()
    sql = """INSERT INTO agent_logs (id, user_id, agent_name, action_type, message, details, timestamp)
             VALUES (?, ?, ?, ?, ?, ?, ?)"""
    params = (
        str(uuid.uuid4()),
        user_id,
        agent_name,
        action_type,
        message,
        json.dumps(details or {}, ensure_ascii=False),
        now_str
    )
    if conn:
        conn.cursor().execute(sql, params)
    else:
        with db_session() as session_conn:
            session_conn.cursor().execute(sql, params)
