"""
Password hashing and JWT tokens — Phase 9.

Password hashing uses PBKDF2-HMAC-SHA256 from Python's standard library
`hashlib` — deliberately NOT bcrypt/argon2. Those are stronger in theory,
but both require a compiled native extension, which is exactly the class
of problem that broke `pip install` earlier in this project (pydantic-core
needed Rust to build on Python 3.14). PBKDF2 via stdlib has zero
compilation risk on any platform, and with a high iteration count it's
still an industry-accepted choice — it's Django's default password
hasher. A stored hash looks like:

    pbkdf2_sha256$<iterations>$<salt_hex>$<hash_hex>

Encoding the algorithm and iteration count INTO the stored string (rather
than assuming a fixed global constant forever) means the iteration count
can be raised later for new passwords without breaking verification of
passwords hashed under the old count — a real technique used by Django
and other frameworks.
"""

import hashlib
import hmac
import os
from datetime import datetime, timedelta, timezone

import jwt

from app.config import JWT_SECRET, JWT_EXPIRE_MINUTES

PBKDF2_ITERATIONS = 260_000


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    derived = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, PBKDF2_ITERATIONS)
    return f"pbkdf2_sha256${PBKDF2_ITERATIONS}${salt.hex()}${derived.hex()}"


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        algo, iterations_str, salt_hex, hash_hex = stored_hash.split("$")
        if algo != "pbkdf2_sha256":
            return False
        iterations = int(iterations_str)
        salt = bytes.fromhex(salt_hex)
        expected = bytes.fromhex(hash_hex)
    except (ValueError, AttributeError):
        return False

    actual = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, iterations)
    # hmac.compare_digest, not ==, to avoid a timing side-channel that
    # could let an attacker guess the hash byte-by-byte.
    return hmac.compare_digest(actual, expected)


def create_access_token(subject_email: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRE_MINUTES)
    payload = {"sub": subject_email, "exp": expire}
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def decode_access_token(token: str) -> dict:
    """Raises jwt.ExpiredSignatureError or jwt.InvalidTokenError on failure."""
    return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
