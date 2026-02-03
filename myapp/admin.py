from django.contrib import admin 
from .models import Lap 
 
 
def format_ms(ms): 
    m  = int(ms // 60000) 
    s  = int((ms % 60000) // 1000) 
    cs = int((ms % 1000) // 10) 
    return f"{m:02d}:{s:02d}.{cs:02d}" 
 
 
@admin.register(Lap) 
class LapAdmin(admin.ModelAdmin): 
    list_display  = ['lap_number', 'lap_time_formatted', 'total_time_formatted', 'created_at'] 
    list_filter   = ['created_at'] 
    search_fields = ['lap_number'] 
    ordering      = ['-created_at'] 
 
    def lap_time_formatted(self, obj): 
        return format_ms(obj.lap_time) 
    lap_time_formatted.short_description = 'Lap Time' 
 
    def total_time_formatted(self, obj): 
        return format_ms(obj.total_time) 
    total_time_formatted.short_description = 'Total Time' 
