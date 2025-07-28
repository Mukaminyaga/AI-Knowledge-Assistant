from alembic import op
import sqlalchemy as sa

revision = 'your_new_revision_id'
down_revision = 'c13b714a0ece'  # make sure this matches correctly
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('payments', 'date',
                    new_column_name='payment_date',
                    existing_type=sa.DateTime())


def downgrade():
    op.alter_column('payments', 'payment_date',
                    new_column_name='date',
                    existing_type=sa.DateTime())
