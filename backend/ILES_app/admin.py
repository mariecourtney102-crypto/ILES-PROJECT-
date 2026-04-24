from django.contrib import admin

from .models import Admin, CustomUser, Evaluation, EvaluationCriteria, InternshipPlacement, Student, Supervisor, WeeklyLog


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'name', 'role', 'ID_number')
    list_filter = ('role',)
    search_fields = ('username', 'name', 'ID_number')


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('id', 'users', 'course_title', 'year_of_study', 'assigned_supervisor')
    search_fields = ('users__username', 'users__name', 'course_title')
    list_filter = ('year_of_study',)


@admin.register(Supervisor)
class SupervisorAdmin(admin.ModelAdmin):
    list_display = ('id', 'users', 'department', 'place_of_work', 'staff_ID')
    search_fields = ('users__username', 'users__name', 'staff_ID', 'department')


@admin.register(Admin)
class AdminProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'users', 'department')
    search_fields = ('users__username', 'users__name', 'department')


@admin.register(WeeklyLog)
class WeeklyLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'week_number', 'status', 'supervisor', 'evaluation_score', 'reviewed_at')
    list_filter = ('status', 'reviewed_at')
    search_fields = ('user__username', 'user__name', 'supervisor__users__name')


admin.site.register(InternshipPlacement)
admin.site.register(EvaluationCriteria)
admin.site.register(Evaluation)
