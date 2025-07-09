"""Add tenant_id to documents

Revision ID: cf0ab2b4bc58
Revises: d98deedc6812
Create Date: 2025-07-08 18:44:55.880621

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cf0ab2b4bc58'
down_revision: Union[str, None] = 'd98deedc6812'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column("documents", sa.Column("tenant_id", sa.Integer(), nullable=True))
    op.create_foreign_key("fk_documents_tenant", "documents", "tenants", ["tenant_id"], ["id"])
    op.execute("UPDATE documents SET tenant_id = 2")  # Use existing tenant id
    op.alter_column("documents", "tenant_id", nullable=False)

def downgrade():
    op.drop_constraint("fk_documents_tenant", "documents", type_="foreignkey")
    op.drop_column("documents", "tenant_id")
