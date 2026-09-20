import os
import sys
import traceback
from pathlib import Path

# Add backend directory and root directory to sys.path
current_dir = Path(__file__).resolve().parent
root_dir = current_dir.parent

possible_paths = [
    root_dir / "backend",
    current_dir / "backend",
    root_dir,
    current_dir,
    Path("/var/task/backend"),
    Path("/var/task"),
]

for p in possible_paths:
    if p.exists() and str(p) not in sys.path:
        sys.path.insert(0, str(p))

try:
    from app.main import app
except Exception as e:
    from fastapi import FastAPI
    from fastapi.responses import JSONResponse
    
    app = FastAPI()
    err_msg = str(e)
    err_tb = traceback.format_exc()
    
    @app.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
    def serverless_error_handler(full_path: str = ""):
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": "EduPath Serverless Function Initialization Error",
                "error": err_msg,
                "traceback": err_tb,
                "sys_path": sys.path,
                "cwd": os.getcwd(),
                "dir_contents": os.listdir(os.getcwd()) if os.path.exists(os.getcwd()) else []
            }
        )
