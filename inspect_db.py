import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

from django.db import connection
from app.models import Products

p=Products.objects.create(name='TestingFull3', price='29.99', specs='Full specs 3', desc='Full desc 3', img='img_test3.jpg')
q=Products.objects.get(id=p.id)
print('PY:', repr(q.name), len(q.name))
print('META name:', Products._meta.get_field('name').get_internal_type(), getattr(Products._meta.get_field('name'), 'max_length', None))
print('META specs:', Products._meta.get_field('specs').get_internal_type())
print('META img:', Products._meta.get_field('img').get_internal_type(), getattr(Products._meta.get_field('img'), 'max_length', None))
with connection.cursor() as c:
    c.execute("SELECT a.attname, pg_catalog.format_type(a.atttypid, a.atttypmod) as col_type FROM pg_attribute a JOIN pg_class c ON a.attrelid=c.oid JOIN pg_namespace n ON c.relnamespace=n.oid WHERE c.relname=%s AND a.attnum>0", ['app_products'])
    print('COLUMNS:', c.fetchall())
    c.execute("SELECT char_length(name), name, char_length(specs), specs, char_length(img), img FROM app_products WHERE id=%s", [q.id])
    print('DB ROW:', c.fetchone())
