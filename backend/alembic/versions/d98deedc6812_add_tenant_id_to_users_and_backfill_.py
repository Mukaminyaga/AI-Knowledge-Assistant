"""Add tenant_id to users and backfill with tenant_id=2

Revision ID: d98deedc6812
Revises: 703ef96aa0c0
Create Date: 2025-07-04 15:06:41.076253

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd98deedc6812'
down_revision: Union[str, None] = '703ef96aa0c0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Step 1: Add tenant_id column as nullable first
    op.add_column('users', sa.Column('tenant_id', sa.Integer(), nullable=True))

    # Step 2: Backfill existing users with tenant_id=2
    op.execute("UPDATE users SET tenant_id = 2")

    # Step 3: Alter column to NOT NULL
    op.alter_column('users', 'tenant_id', nullable=False)

    # Step 4: Add the foreign key constraint
    op.create_foreign_key('fk_users_tenant_id', 'users', 'tenants', ['tenant_id'], ['id'])


def downgrade():
    op.drop_constraint('fk_users_tenant_id', 'users', type_='foreignkey')
    op.drop_column('users', 'tenant_id')
