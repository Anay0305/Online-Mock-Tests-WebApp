#!/bin/bash
gunicorn WebApp.wsgi:application --config config/gunicorn.conf.py