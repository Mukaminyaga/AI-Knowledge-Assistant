"""Add response, user_id, tenant_id to ChatMessage

Revision ID: a17b43848a3d
Revises: 8e57732d71cf
Create Date: 2025-07-29 11:25:53.826941

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'a17b43848a3d'
down_revision: Union[str, None] = '8e57732d71cf'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade():
    op.add_column('chat_messages', sa.Column('response', sa.Text(), nullable=True))
    op.add_column('chat_messages', sa.Column('user_id', sa.Integer(), nullable=True))
    op.add_column('chat_messages', sa.Column('tenant_id', sa.Integer(), nullable=True))

    op.create_foreign_key(
        'fk_chat_messages_user_id_users',
        'chat_messages',
        'users',
        ['user_id'],
        ['id'],
        ondelete='SET NULL'
    )


def downgrade():
    op.drop_constraint('fk_chat_messages_user_id_users', 'chat_messages', type_='foreignkey')
    op.drop_column('chat_messages', 'tenant_id')
    op.drop_column('chat_messages', 'user_id')
    op.drop_column('chat_messages', 'response')