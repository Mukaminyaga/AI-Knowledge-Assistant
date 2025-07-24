# app/models/__init__.py
from app.models.tenant import Tenant
from app.models.document import Document
from app.models.document_interaction import DocumentInteraction
from app.models.users import User
from app.models.department import Department

from ..database import Base  # Ensure this is the same Base
