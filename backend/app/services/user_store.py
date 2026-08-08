import uuid

from app.services.json_store import read_json, write_json
from app.services.security import hash_password, verify_password

USERS_FILE = "users.json"


def _load_users() -> list[dict]:
    return read_json(USERS_FILE, [])


def _save_users(users: list[dict]) -> None:
    write_json(USERS_FILE, users)


def get_user_by_email(email: str) -> dict | None:
    email = email.lower().strip()
    return next((u for u in _load_users() if u["email"] == email), None)


def create_user(name: str, email: str, password: str) -> dict:
    email = email.lower().strip()
    if get_user_by_email(email):
        raise ValueError("An account with this email already exists.")

    user = {
        "id": str(uuid.uuid4()),
        "name": name.strip(),
        "email": email,
        "password_hash": hash_password(password),
    }
    users = _load_users()
    users.append(user)
    _save_users(users)
    return user


def authenticate(email: str, password: str) -> dict | None:
    user = get_user_by_email(email)
    if not user or not verify_password(password, user["password_hash"]):
        return None
    return user
