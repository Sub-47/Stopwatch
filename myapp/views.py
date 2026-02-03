import json 
from django.shortcuts import render 
from django.http import JsonResponse 
from django.views.decorators.csrf import csrf_exempt 
from .models import Lap 
 
 
def stopwatch(request): 
    return render(request, 'myapp/stopwatch.html') 
 
 
def get_laps(request): 
    laps = Lap.objects.all().values('id', 'lap_number', 'lap_time', 'total_time') 
    return JsonResponse(list(laps), safe=False) 
 
 
@csrf_exempt 
def save_lap(request): 
    if request.method != 'POST': 
        return JsonResponse({'error': 'POST only'}, status=405) 
    try: 
        data = json.loads(request.body) 
        lap = Lap.objects.create( 
            lap_number=data['lap_number'], 
            lap_time=data['lap_time'], 
            total_time=data['total_time'], 
        ) 
        return JsonResponse({'id': lap.id, 'status': 'saved'}) 
    except Exception as e: 
        return JsonResponse({'error': str(e)}, status=400) 
 
 
@csrf_exempt 
def delete_lap(request, lap_id): 
    if request.method != 'DELETE': 
        return JsonResponse({'error': 'DELETE only'}, status=405) 
    try: 
        Lap.objects.get(id=lap_id).delete() 
        return JsonResponse({'status': 'deleted'}) 
    except Lap.DoesNotExist: 
        return JsonResponse({'error': 'Lap not found'}, status=404) 
 
 
@csrf_exempt 
def clear_all_laps(request): 
    if request.method != 'DELETE': 
        return JsonResponse({'error': 'DELETE only'}, status=405) 
    Lap.objects.all().delete() 
    return JsonResponse({'status': 'all cleared'}) 
