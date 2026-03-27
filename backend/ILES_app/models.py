from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('academic supervisor', 'Academic Supervisor'),
        ('workplace supervisor', 'Workplace Supervisor'),
        ('internship coordinator', 'Internship Coordinator')
    ]
    name = models.CharField(max_length=50)
    role = models.CharField(max_length=50, choices = ROLE_CHOICES)
    ID_number = models.CharField(max_length=20, unique=True)
    telephone_number = models.CharField(max_length=15, blank=True, null=True)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name= 'customuser_permissions',
        blank=True
    )
    def _str_(self):
        return f"(self.username) ({self.role})"

class Student(models.Model):
    users = models.OneToOneField(CustomUser,on_delete=models.CASCADE)
    course_title = models.CharField(max_length=50)
    university_name = models.CharField(max_length=60)
    year_of_study = models.IntegerField()
    
    def __str__(self):
        return f"{self.user.username} -STUDENT"
    
class Acadamic_supervisor(models.Model):
    users = models.OneToOneField(CustomUser,on_delete=models.CASCADE)
    department = models.CharField(max_length=100)
    staff_ID = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return f"{self.user.username} -ACADEMIC SUPERVISOR"

class Workplace_supervisor(models.Model):
    users = models.OneToOneField(CustomUser,on_delete=models.CASCADE)
    place_of_work = models.CharField(max_length=100)
    department = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user.username} -WORKPLACE SUPERVISOR"

class Internship_coordinator(models.Model):
    users = models.OneToOneField(CustomUser,on_delete=models.CASCADE)
    department = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user.username} -INTERNSHIP COORDINATOR"