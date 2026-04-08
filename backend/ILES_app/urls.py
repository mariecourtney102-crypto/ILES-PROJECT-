from django.urls import path
from .views import test_api,signup,login

urlpatterns = [
    path('test/', test_api),
    path('signup/', signup),
    path('login/', login),
]