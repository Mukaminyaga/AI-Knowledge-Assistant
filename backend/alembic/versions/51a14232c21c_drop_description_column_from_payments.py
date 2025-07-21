"""drop description column from payments

Revision ID: 51a14232c21c
Revises: 30b75c0c57f6
Create Date: 2025-07-21 09:47:16.224657

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '51a14232c21c'
down_revision: Union[str, None] = '30b75c0c57f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.drop_column('payments', 'description')


def downgrade():
    op.add_column('payments', sa.Column('description', sa.String(), nullable=True))
