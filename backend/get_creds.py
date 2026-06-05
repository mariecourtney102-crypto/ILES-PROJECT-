import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ILES_project.settings')
import django
django.setup()

from rest_framework.authtoken.models import Token
from ILES_app.models import Student, Supervisor

token = Token.objects.filter(user__username='testadmin').first()
student = Student.objects.filter(users__username='teststd').last()
supervisor = Supervisor.objects.filter(users__username='testsup').last()

print(f'Token: {token.key if token else "NOT FOUND"}')
print(f'Student ID: {student.id if student else "NOT FOUND"}')
print(f'Supervisor ID: {supervisor.id if supervisor else "NOT FOUND"}')
