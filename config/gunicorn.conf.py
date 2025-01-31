bind="0.0.0.0:80"
workers=3

accesslog="/app/logs/gunicorn.access.log"
errorlog="/app/logs/gunicord.app.log"
capture_output=True
loglevel="info"