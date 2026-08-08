from fastapi import APIRouter, Depends, HTTPException

from app.dependencies import get_current_user
from app.schemas.auth import LoginRequest, SignupRequest, TokenResponse, UserPublic
from app.services import user_store
from app.services.security import create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _to_token_response(user: dict) -> TokenResponse:
    token = create_access_token(subject_email=user["email"])
    return TokenResponse(
        access_token=token,
        user=UserPublic(id=user["id"], name=user["name"], email=user["email"]),
    )


@router.post("/signup", response_model=TokenResponse)
def signup(body: SignupRequest) -> TokenResponse:
    try:
        user = user_store.create_user(body.name, body.email, body.password)
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc))
    return _to_token_response(user)


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest) -> TokenResponse:
    user = user_store.authenticate(body.email, body.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password.")
    return _to_token_response(user)


@router.get("/me", response_model=UserPublic)
def me(current_user: dict = Depends(get_current_user)) -> UserPublic:
    return UserPublic(id=current_user["id"], name=current_user["name"], email=current_user["email"])
