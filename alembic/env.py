import os
import sys
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context


# ✅ Ensure this path includes 'backend'
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

# ✅ Now this will work
from app.models.users import Base  
target_metadata = Base.metadata

# DB URL
from dotenv import load_dotenv
load_dotenv()
config = context.config
config.set_main_option("sqlalchemy.url", os.getenv("DATABASE_URL"))

# Logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

print("Loaded Base metadata from:", Base)
