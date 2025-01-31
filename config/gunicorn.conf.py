bind="0.0.0.0:80"
workers=3

accesslog="/WebApplogs/gunicorn.access.log"
errorlog="/WebApplogs/gunicord.app.log"
capture_output=True
loglevel="info"