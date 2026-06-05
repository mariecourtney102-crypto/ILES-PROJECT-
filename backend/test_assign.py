#!/usr/bin/env python
import os
import sys
import django
sys.path.insert(0, os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ILES_project.settings')
django.setup()

from ILES_app.models import CustomUser, Student, Supervisor, Company
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

# Clean up old test data
CustomUser.objects.filter(username__startswith='test').delete()
Company.objects.filter(name__startswith='test').delete()

# Create test admin
admin = CustomUser.objects.create_user(
    username='testadmin',
    password='pass123',
    role='admin',
    name='Test Admin',
    ID_number='ADM123',
    email='admin@test.com'
)
admin_token, _ = Token.objects.get_or_create(user=admin)
print(f"✓ Admin created: {admin.username}")

# Create company and supervisor
company = Company.objects.create(name='test_company')
sup_user = CustomUser.objects.create_user(
    username='testsup',
    password='pass123',
    role='supervisor',
    name='Test Supervisor',
    ID_number='SUP123',
    email='sup@test.com'
)
supervisor = Supervisor.objects.create(users=sup_user, place_of_work=company, department='IT', staff_ID='ST001')
print(f"✓ Supervisor created: {supervisor.id}")

# Create student
std_user = CustomUser.objects.create_user(
    username='teststd',
    password='pass123',
    role='student',
    name='Test Student',
    ID_number='STD123',
    email='std@test.com'
)
student = Student.objects.create(users=std_user, course_title='CS', university_name='Test Uni', year_of_study=3)
print(f"✓ Student created: {student.id}")

# Test API
client = APIClient()
client.credentials(HTTP_AUTHORIZATION=f'Token {admin_token.key}')

try:
    from django.urls import reverse
    response = client.post(reverse('assign_supervisor'), {
        'student_id': student.id,
        'supervisor_id': supervisor.id
    }, format='json')
except Exception as e:
    print(f"✗ URL Reverse Error: {e}")
    # Try direct path with /api prefix
    response = client.post('/api/assign-supervisor/', {
        'student_id': student.id,
        'supervisor_id': supervisor.id
    }, format='json')


print(f"\n✓ API Response: {response.status_code}")
if response.status_code == 200 or response.status_code == 201:
    print(f"  Data: {response.data}")
else:
    import json
    try:
        print(f"  Data: {json.loads(response.content)}")
    except:
        print(f"  Content: {response.content}")


# Verify assignment
student.refresh_from_db()
print(f"\n✓ Student assigned_supervisor: {student.assigned_supervisor_id}")
