from django.urls import path
from .import views



urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('criteria/', views.get_criteria, name= 'get-criteria')
]