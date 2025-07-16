# app/utils/permissions.py

from fastapi import HTTPException
from app.models.users import User

def ensure_permission(user: User, allowed_roles: list):
    if user.role.lower() not in [role.lower() for role in allowed_roles]:
        raise HTTPException(status_code=403, detail="Permission denied.")
