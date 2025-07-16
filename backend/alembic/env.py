from logging.config import fileConfig
import sys
import os

from sqlalchemy import engine_from_config, pool, create_engine
from alembic import context

# ✅ Load environment variables
from dotenv import load_dotenv
load_dotenv()

# ✅ Add project path to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# ✅ Import your Base and all models
from app.database import Base
from app.models import tenant, users, document, document_interaction

# ✅ Alembic Config object
config = context.config

# ✅ Set the sqlalchemy.url dynamically from .env
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL:
    config.set_main_option("sqlalchemy.url", DATABASE_URL)
else:
    raise RuntimeError("DATABASE_URL not found in environment")

# ✅ Python logging setup
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# ✅ Target metadata for 'autogenerate' support
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    engine = create_engine(DATABASE_URL, poolclass=pool.NullPool)

    with engine.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
