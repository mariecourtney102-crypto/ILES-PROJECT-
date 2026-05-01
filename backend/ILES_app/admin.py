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
)

admin.site.register(CustomUser)
admin.site.register(Student)
admin.site.register(Supervisor)
admin.site.register(AdminModel)
admin.site.register(InternshipPlacement)
admin.site.register(WeeklyLog)
admin.site.register(EvaluationCriteria)
admin.site.register(Evaluation)
admin.site.register(Feedback)
admin.site.register(SiteSetting)
admin.site.register(Notification)
