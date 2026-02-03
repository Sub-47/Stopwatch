
# Stopwatch

A simple stopwatch web app built with Django. You can start, stop, lap, and reset the timer. All your laps get saved in the database so they stay even if you refresh or close the browser. You can also go to the admin page and manage everything from there.

## What you need

- Python 3.x
- Django

## How to run it

Clone the repo or download the files, then open a terminal in the project folder and run:

```
pip install django
python manage.py migrate
python manage.py runserver
```

That's it. Go to http://127.0.0.1:8000/stopwatch/ and it should be up.

## Admin panel

If you want to view, edit, or delete laps manually, create a superuser first:

```
python manage.py createsuperuser
```

Then go to http://127.0.0.1:8000/admin/ and log in.

## How it works

The frontend is just HTML, CSS, and vanilla JavaScript. When you hit the lap button it saves the time to the database through a simple API. The admin panel is Django's built-in one so you don't have to build anything extra for that.
