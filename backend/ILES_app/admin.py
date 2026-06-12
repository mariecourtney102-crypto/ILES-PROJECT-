from django.contrib import admin
from .models import (
    CustomUser,
    Student,
    Supervisor,
    Admin as AdminModel,
    InternshipPlacement,
    WeeklyLog,
    EvaluationCriteria,
    Evaluation,
    Feedback,
    SiteSetting,
    Notification,
    Company
)


class StudentAdmin(admin.ModelAdmin):
    list_display = ('users', 'course_title', 'university_name', 'year_of_study', 'assigned_supervisor')
    list_filter = ('year_of_study', 'university_name')
    search_fields = (
        'users__username',
        'users__name',
        'assigned_supervisor__users__username',
        'assigned_supervisor__users__name',
    )
    raw_id_fields = ('assigned_supervisor',)


admin.site.register(CustomUser)
admin.site.register(Student, StudentAdmin)
admin.site.register(Supervisor)
admin.site.register(AdminModel)
admin.site.register(InternshipPlacement)
admin.site.register(WeeklyLog)
admin.site.register(EvaluationCriteria)
admin.site.register(Evaluation)
admin.site.register(Feedback)
admin.site.register(SiteSetting)
admin.site.register(Notification)
admin.site.register(Company)

