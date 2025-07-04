# app/models/__init__.py
from .users import User
from .document import Document
from .tenant import Tenant
from ..database import Base  # Ensure this is the same Base
