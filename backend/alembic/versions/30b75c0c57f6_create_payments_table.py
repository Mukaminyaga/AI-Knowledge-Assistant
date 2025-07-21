"""create payments table

Revision ID: 30b75c0c57f6
Revises: 8f801c2979f8
Create Date: 2025-07-21 09:15:26.588971

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '30b75c0c57f6'
down_revision: Union[str, None] = '8f801c2979f8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        'payments',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('invoice_id', sa.String(), nullable=False, unique=True),
        sa.Column('tenant_id', sa.Integer(), sa.ForeignKey('tenants.id'), nullable=False),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column('status', sa.String(), nullable=False),
        sa.Column('payment_method', sa.String(), nullable=False),
        sa.Column('due_date', sa.DateTime(), nullable=False),
        sa.Column('date', sa.DateTime(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
    )


def downgrade():
    op.drop_table('payments')