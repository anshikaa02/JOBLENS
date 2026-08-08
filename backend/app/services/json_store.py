"""
JSON file storage — Phase 9's persistence layer.

The original project spec explicitly allows this: "For the MVP, local
JSON storage is acceptable if it simplifies development." This module is
intentionally small and generic (read_json/write_json, not "UserStore")
so that swapping to real MongoDB in Phase 10 means changing
user_store.py's internals to use pymongo instead of this file — nothing
in routers/ or the rest of the app needs to know or care how users are
actually persisted.
"""

import json
import os
import threading

_lock = threading.Lock()
_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")


def _path(filename: str) -> str:
    os.makedirs(_DATA_DIR, exist_ok=True)
    return os.path.join(_DATA_DIR, filename)


def read_json(filename: str, default):
    path = _path(filename)
    if not os.path.exists(path):
        return default
    with _lock:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)


def write_json(filename: str, data) -> None:
    path = _path(filename)
    with _lock:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
