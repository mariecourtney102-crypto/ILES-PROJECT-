from django.urls import path
from .import views



urlpatterns = [
    path('choose-role/', views.choose_role, name='choose_role'),
    path('test/', views.test_api, name='test_api'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('students/', views.list_students, name='list_students'),
    path('supervisors/', views.list_supervisors, name='list_supervisors'),
    path('assign-supervisor/', views.assign_supervisor, name='assign_supervisor'),
    path('placement/', views.get_placement, name='get_placement'),
    path('placement/create/', views.create_placement, name='create_placement'),
    path('placement/update/', views.update_placement, name='update_placement'),
    path('placement/delete/', views.delete_placement, name='delete_placement'),
    path('weekly-logs/create/', views.create_weekly_log, name='create_weekly_log'),
    path('weekly-logs/my/', views.my_weekly_logs, name='my_weekly_logs'),
    path('supervisor/students/', views.supervisor_students, name='supervisor_students'),
    path('supervisor/weekly-logs/', views.supervisor_weekly_logs, name='supervisor_weekly_logs'),
    path('supervisor/weekly-logs/<int:log_id>/review/', views.review_weekly_log, name='review_weekly_log'),
]
