from django.urls import path
from .import views



urlpatterns = [
    path('choose-role/', views.choose_role, name='choose_role'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
]