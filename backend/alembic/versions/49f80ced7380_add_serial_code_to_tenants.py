"""Add serial_code to tenants

Revision ID: 49f80ced7380
Revises: cf0ab2b4bc58
Create Date: 2025-07-11 15:59:51.194812

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '49f80ced7380'
down_revision: Union[str, None] = 'cf0ab2b4bc58'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add the new column
    op.add_column('tenants', sa.Column('serial_code', sa.String(length=6), nullable=True))  # Temporarily nullable

    # Populate serial_code for existing tenants (000001 to 000007)
    conn = op.get_bind()
    tenants = conn.execute(sa.text("SELECT id FROM tenants ORDER BY id")).fetchall()

    for index, tenant in enumerate(tenants, start=1):
        serial = f"{index:06d}"
        conn.execute(
            sa.text("UPDATE tenants SET serial_code = :serial WHERE id = :id"),
            {"serial": serial, "id": tenant.id}
        )

    # Make the column NOT NULL after population
    op.alter_column('tenants', 'serial_code', nullable=False)

    # Add constraints
    op.create_unique_constraint("uq_tenants_serial_code", "tenants", ["serial_code"])
    op.create_unique_constraint("uq_tenants_company_name", "tenants", ["company_name"])

def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint("uq_tenants_serial_code", "tenants", type_='unique')
    op.drop_constraint("uq_tenants_company_name", "tenants", type_='unique')
    op.drop_column('tenants', 'serial_code')
