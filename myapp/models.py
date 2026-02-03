from django.db import models 
 
 
class Lap(models.Model): 
    lap_number = models.PositiveIntegerField() 
    lap_time   = models.FloatField() 
    total_time = models.FloatField() 
    created_at = models.DateTimeField(auto_now_add=True) 
 
    class Meta: 
        ordering = ['-created_at'] 
 
    def __str__(self): 
        m  = int(self.lap_time // 60000) 
        s  = int((self.lap_time % 60000) // 1000) 
        cs = int((self.lap_time % 1000) // 10) 
        return f"Lap {self.lap_number} — {m:02d}:{s:02d}.{cs:02d}" 
