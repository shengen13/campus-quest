import json
import os
from functools import lru_cache
from typing import Any

import firebase_admin
from firebase_admin import credentials, auth
from dotenv import load_dotenv

load_dotenv()


def _initialize():
    """Initialize Firebase Admin SDK using the configured service account."""

    if firebase_admin._apps:
        return firebase_admin.get_app()

    raw = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")

    if raw:
        return firebase_admin.initialize_app(
            credentials.Certificate(json.loads(raw))
        )

    path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

    if path:
        return firebase_admin.initialize_app(
            credentials.Certificate(path)
        )

    raise RuntimeError(
        "Firebase Admin credentials are not configured. "
        "Set GOOGLE_APPLICATION_CREDENTIALS or "
        "FIREBASE_SERVICE_ACCOUNT_JSON in backend/.env."
    )


@lru_cache(maxsize=1)
def firebase_app():
    """Return the initialized Firebase Admin application."""
    return _initialize()


def verify_bearer_token(authorization: str) -> dict[str, Any]:
    """Verify a Firebase ID token from an Authorization header."""

    if not authorization or not authorization.startswith("Bearer "):
        raise ValueError("Missing Firebase ID token.")

    token = authorization[7:].strip()

    if not token:
        raise ValueError("Missing Firebase ID token.")

    # IMPORTANT:
    # Ensure the Firebase Admin SDK is initialized before verification.
    firebase_app()

    try:
        return auth.verify_id_token(token)
    except Exception as exc:
        raise ValueError("Invalid Firebase ID token.") from exc