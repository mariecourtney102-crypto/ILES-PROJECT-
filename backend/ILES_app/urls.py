from django.urls import path
from .import views



urlpatterns = [
    path('choose-role/', views.choose_role, name='choose_role'),
    path('test/', views.test_api, name='test_api'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('logout/', views.logoutUser, name='logout'),
    path('profile/', views.profile, name='profile'),
    path('search-internships/', views.search_internships, name='search_internships'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('students/', views.list_students, name='list_students'),
    path('supervisors/', views.list_supervisors, name='list_supervisors'),
    path('assign-supervisor/', views.assign_supervisor, name='assign_supervisor'),
    path('placement/', views.get_placement, name='get_placement'),
    path('placement/create/', views.create_placement, name='create_placement'),
    path('placement/update/', views.update_placement, name='update_placement'),
    path('placement/delete/', views.delete_placement, name='delete_placement'),
    path('weekly-logs/draft/', views.save_weekly_log_draft, name='save_weekly_log_draft'),
    path('weekly-logs/create/', views.create_weekly_log, name='create_weekly_log'),
    path('weekly-logs/<int:log_id>/submit/', views.submit_weekly_log, name='submit_weekly_log'),
    path('weekly-logs/my/', views.my_weekly_logs, name='my_weekly_logs'),
    path('supervisor/students/', views.supervisor_students, name='supervisor_students'),
    path('supervisor/weekly-logs/', views.supervisor_weekly_logs, name='supervisor_weekly_logs'),
    path('supervisor/weekly-logs/<int:log_id>/review/', views.review_weekly_log, name='review_weekly_log'),
    path('reports/', views.reports, name='reports'),
    path('opportunities/', views.opportunities, name='opportunities'),
    path('feedback/', views.feedback, name='feedback'),
    path('settings/', views.settings, name='settings'),
    path('notifications/', views.notifications, name='notifications'),
    path('notifications/read-all/', views.mark_all_notifications_read, name='mark_all_notifications_read'),
    path('notifications/<int:notification_id>/read/', views.mark_notification_read, name='mark_notification_read'),


    #Criteria
   # path('criteria/', views.get_criteria, name='get-criteria'),

    #Internship Placement
    path('placement/create/', views.create_placement, name='create-placement'),
    path('placement/', views.get_placement, name='get-placement'),
    path('placement/update/', views.update_placement, name='update-placement'),
    path('placement/delete/', views.delete_placement, name='delete-placement'),

    #Weekly Logs
   # path('logs/create/', views.create_log, name='create-log'),
    #path('logs/', views.get_logs, name='get-logs'),
    path('logs/<int:log_id>/review/', views.review_log, name='review-log'),

    #Evaluations
    path('evaluations/create/', views.create_evaluation, name='create-evaluation'),
    path('evaluations/', views.get_evaluation, name='get-evaluation'),

    #Admin
    path('admin/dashboard/', views.admin_dashboard, name='admin-dashboard'),
    path('admin/dashboard-view/', views.admin_dashboard_view, name='admin-dashboard-view'),
    path('admin/opportunities/', views.get_opportunities),
    path('admin/students/', views.get_students),
    path('admin/supervisors/', views.get_supervisors),
    path('admin/reports/', views.get_reports),
    path('admin/change-password/', views.change_password),
    path('feedback/', views.get_feedback, name='get-feedback'),
    path('admin/supervisors/', views.supervisors_list),
    path('admin/users/<int:pk>/', views.assign_supervisor),
]
