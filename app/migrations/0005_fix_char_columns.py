"""Fix columns that were incorrectly created as char(1).

This migration alters the columns in PostgreSQL to the intended types.
"""
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_alter_products_id'),
    ]

    operations = [
        migrations.RunSQL(
            sql=(
                'ALTER TABLE app_products ALTER COLUMN "name" TYPE varchar(255); '
                'ALTER TABLE app_products ALTER COLUMN "specs" TYPE text; '
                'ALTER TABLE app_products ALTER COLUMN "desc" TYPE text; '
                'ALTER TABLE app_products ALTER COLUMN "img" TYPE varchar(255);'
            ),
            reverse_sql=(
                "-- reverse: best-effort, do not shrink columns automatically"
                "SELECT 1;"
            ),
        ),
    ]
