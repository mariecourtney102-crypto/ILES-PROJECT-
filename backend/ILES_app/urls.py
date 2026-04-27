from django.urls import path
from .import views



urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('criteria/', views.get_criteria, name= 'get-criteria'),
    path('', views.login, name='home'),
    path('choose-role/', views.choose_role, name='choose_role'),
    path('dashboard/', views.dashboard, name='dashboard')
]