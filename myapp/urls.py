from django.urls import path
from . import views

urlpatterns = [
    path('stopwatch/',                    views.stopwatch,      name='stopwatch'),
    path('api/laps/',                     views.get_laps,       name='get-laps'),
    path('api/laps/save/',                views.save_lap,       name='save-lap'),
    path('api/laps/clear/',               views.clear_all_laps, name='clear-laps'),
    path('api/laps/delete/<int:lap_id>/', views.delete_lap,     name='delete-lap'),
]