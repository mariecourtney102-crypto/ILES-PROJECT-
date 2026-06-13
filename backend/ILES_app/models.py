from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('supervisor', 'Supervisor'),
        ('admin', 'Admin'),
    ]
    name = models.CharField(max_length=50)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    ID_number = models.CharField(max_length=20, unique=True)
    telephone_number = models.CharField(max_length=15, blank=True, null=True)
    
    # Email verification fields
    email = models.EmailField(unique=True)  # Make email required and unique
    is_verified = models.BooleanField(default=False)
    email_verified_at = models.DateTimeField(null=True, blank=True)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_permissions',
        blank=True
    )
    
    def __str__(self):
        return f"{self.username} ({self.role})"
    
class Company(models.Model):
    name = models.CharField(max_length=300)

    def __str__(self):
        return self.name


class Student(models.Model):
    users = models.OneToOneField(CustomUser,on_delete=models.CASCADE)
    course_title = models.CharField(max_length=50)
    university_name = models.CharField(max_length=60)
    year_of_study = models.IntegerField()
    assigned_supervisor = models.ForeignKey(
        'Supervisor',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_students'
    )
    
    def __str__(self):
        return f"{self.users.username} -STUDENT"
    
class Supervisor(models.Model):
    users = models.OneToOneField(CustomUser,on_delete=models.CASCADE)
    place_of_work = models.ForeignKey('Company', on_delete=models.CASCADE)
    department = models.CharField(max_length=100)
    staff_ID = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return f"{self.users.username} -SUPERVISOR"


class Admin(models.Model):
    users = models.OneToOneField(CustomUser,on_delete=models.CASCADE)
    department = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.users.username} -ADMIN"
    
class InternshipPlacement(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    place_of_internship = models.ForeignKey('Company', on_delete=models.CASCADE)
    department = models.CharField(max_length=100)
    supervisor_name = models.CharField(max_length=50)
    start_date = models.DateField()
    end_date = models.DateField()
    

    def __str__(self):
        return f"{self.student.username} - {self.place_of_internship}"
    
class WeeklyLog(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('evaluated', 'Evaluated'),
        ('rejected', 'Rejected')
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='weekly_logs')
    week_number = models.IntegerField()
    description = models.TextField()
    date_submitted = models.DateTimeField(auto_now_add=True)
    supervisor = models.ForeignKey(
        Supervisor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_logs'
    )
    supervisor_comment = models.TextField(blank=True)
    evaluation_score = models.PositiveIntegerField(null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')

    def __str__(self):
        return f"Week {self.week_number} - {self.student} - {self.status}"
    
class EvaluationCriteria(models.Model):
    CRITERIA_CHOICES =[
        ('technical', 'Technical Skills'),
        ('cognitive', 'Cognitive Skills'),
        ('soft', 'Soft Skills'),
        ('professional', 'Professionalism'),
    ]
    criteria_name =  models.CharField(max_length=150)
    criteria = models.CharField(max_length=20, choices=CRITERIA_CHOICES)
    criteria_weight = models.FloatField(default=0.25, help_text="Fixed at 0.25 for each criterion.")

    def __str__(self):
        return f"{self.criteria_name} - {self.criteria}"
    
class Evaluation(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    placement = models.ForeignKey(InternshipPlacement, on_delete=models.CASCADE)
    weekly_log = models.ForeignKey(
        WeeklyLog,
        on_delete=models.CASCADE,
        related_name='evaluations',
        null=True,
        blank=True,
    )
    criteria = models.ForeignKey(EvaluationCriteria, on_delete=models.SET_NULL, null=True)
    score = models.PositiveIntegerField()
    comment = models.TextField(blank=True)
    evaluation_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.placement.student.username} - {self.criteria}: {self.score}"


class AcademicEvaluation(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='academic_evaluations')
    supervisor = models.ForeignKey(
        Supervisor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='academic_evaluations'
    )
    placement = models.ForeignKey(
        InternshipPlacement,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='academic_evaluations'
    )
    term = models.CharField(max_length=50, blank=True)
    academic_year = models.CharField(max_length=20, blank=True)
    total_weighted_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    grade = models.CharField(max_length=5, blank=True)
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student.users.username} - {self.term or self.academic_year or 'Evaluation'}"


class AcademicEvaluationDetail(models.Model):
    academic_evaluation = models.ForeignKey(
        AcademicEvaluation,
        on_delete=models.CASCADE,
        related_name='details'
    )
    subject = models.CharField(max_length=100)
    score = models.DecimalField(max_digits=5, decimal_places=2)
    max_score = models.DecimalField(max_digits=5, decimal_places=2, default=100)
    weight = models.FloatField(default=0.0)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def normalized_score(self):
        if self.max_score <= 0:
            return 0
        return float(self.score) / float(self.max_score) * 100

    def weighted_contribution(self):
        return self.normalized_score() * self.weight

    def __str__(self):
        return f"{self.academic_evaluation.student.users.username} - {self.subject}: {self.score}/{self.max_score}"


class Feedback(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='feedback')
    subject = models.CharField(max_length=150)
    message = models.TextField()
    rating = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.subject} - {self.user.username}"


class SiteSetting(models.Model):
    site_name = models.CharField(max_length=100, default='ILES')
    admin_email = models.EmailField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.site_name


class Notification(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=150)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.user.username}"

