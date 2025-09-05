from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func
from ..database import Base

class LoginAttempt(Base):
    __tablename__ = "login_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # null if user not found
    email = Column(String, nullable=False)
    success = Column(Boolean, default=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
