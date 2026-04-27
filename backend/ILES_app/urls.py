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
    path('criteria/', views.get_criteria, name='get-criteria')
]