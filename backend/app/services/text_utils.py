import re

BULLET_LINE_RE = re.compile(r"^\s*([•\-\*▪●]|(\d+[\.\)]))\s+")


def extract_bullet_lines(text: str) -> list[str]:
    """Return resume bullet points, stripped of their leading bullet marker."""
    bullets = []
    for line in text.splitlines():
        if BULLET_LINE_RE.match(line):
            bullets.append(BULLET_LINE_RE.sub("", line).strip())
    return bullets
