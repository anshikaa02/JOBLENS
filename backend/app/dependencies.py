import jwt
from fastapi import Header, HTTPException

from app.services.security import decode_access_token
from app.services.user_store import get_user_by_email


def get_current_user(authorization: str | None = Header(default=None)) -> dict:
    """
    Use as a route dependency: `current_user: dict = Depends(get_current_user)`.
    Raises 401 for any missing/invalid/expired token — the frontend's axios
    interceptor (see frontend/src/lib/api.ts) attaches the header
    automatically on every request once a user is logged in.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated.")

    token = authorization.removeprefix("Bearer ").strip()
    try:
        payload = decode_access_token(token)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired. Please log in again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid authentication token.")

    user = get_user_by_email(payload.get("sub", ""))
    if not user:
        raise HTTPException(status_code=401, detail="User no longer exists.")
    return user
