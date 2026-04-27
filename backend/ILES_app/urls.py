from django.urls import path
from .import views

urlpatterns = [
    #Authentication
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout_view, name='logout'),

    #Profiles and Roles
    path('profile/', views.profile, name='profile'),
    path('choose-role/', views.choose_role, name='choose-role'),
    path('dashboard/', views.dashboard, name='dashboard'),

    #Criteria
    path('criteria/', views.get_criteria, name='get-criteria'),

    #Internship Placement
    path('placement/create/', views.create_placement, name='create-placement'),
    path('placement/', views.get_placement, name='get-placement'),
    path('placement/update/', views.update_placement, name='update-placement'),
    path('placement/delete/', views.delete_placement, name='delete-placement'),

    #Weekly Logs
    path('logs/create/', views.create_log, name='create-log'),
    path('logs/', views.get_logs, name='get-logs'),
    path('logs/<int:log_id>/review/', views.review_log, name='review-log'),

    #Evaluations
    path('evaluations/create/', views.create_evaluation, name='create-evaluation'),
    path('evaluations/', views.get_evaluation, name='get-evaluation')
]