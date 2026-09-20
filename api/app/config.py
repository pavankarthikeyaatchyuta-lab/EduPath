import os
from pathlib import Path
from pydantic import BaseModel
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
# Load environment variables from .env in project root or backend dir
load_dotenv(BASE_DIR.parent / ".env", override=True)
load_dotenv(BASE_DIR / ".env", override=True)
load_dotenv(override=True)

is_serverless = bool(
    os.getenv("VERCEL") or 
    os.getenv("VERCEL_ENV") or 
    os.getenv("AWS_LAMBDA_FUNCTION_NAME") or 
    os.getenv("VERCEL_REGION") or 
    os.getenv("NOW_REGION") or
    (os.path.exists("/tmp") and os.name != "nt")
)
default_db = "/tmp/edupath.db" if is_serverless else str(BASE_DIR / "edupath.db")
default_uploads = "/tmp/uploads" if is_serverless else str(BASE_DIR / "uploads")

DB_PATH = os.getenv("EDUPATH_DB_PATH", default_db)

class Settings(BaseModel):
    app_name: str = "EduPath AI"
    app_version: str = "1.0.0"
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    llm_provider: str = os.getenv("LLM_PROVIDER", "auto") # auto, gemini, groq, mock
    llm_model: str = os.getenv("LLM_MODEL", "gemini-3.6-flash")
    db_path: str = DB_PATH
    upload_dir: str = default_uploads

settings = Settings()
try:
    os.makedirs(settings.upload_dir, exist_ok=True)
except Exception:
    pass
