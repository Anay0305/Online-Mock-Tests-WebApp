#!/bin/bash
gunicorn WebApp.wsgi:application --config /path/to/your/gunicorn.conf.py --bind 0.0.0.0:8000