#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "[CAMPUS QUEST] Initializing FastAPI DormNet Server with Uvicorn..."
python3 -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload
