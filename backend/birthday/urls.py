from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('birthday/', views.birthday_view, name='birthday'),
    path('memories/', views.memories_view, name='memories'),
    path('reasons/', views.reasons_view, name='reasons'),
    path('messages/', views.messages_view, name='messages'),
    path('countdown/', views.countdown_view, name='countdown'),
    # Admin endpoints
    path('admin/login/', views.admin_login_view, name='admin-login'),
    path('admin/birthday/', views.admin_birthday_view, name='admin-birthday'),
    path('admin/memories/', views.admin_memories_view, name='admin-memories'),
    path('admin/memories/<int:pk>/', views.admin_memory_delete_view, name='admin-memory-delete'),
    path('admin/reasons/', views.admin_reasons_view, name='admin-reasons'),
    path('admin/reasons/<int:pk>/', views.admin_reason_delete_view, name='admin-reason-delete'),
    path('admin/change-password/', views.admin_change_password_view, name='admin-change-password'),
]
