from django.db import models

class Attempts(models.Model):
    username = models.TextField(primary_key=True)
    data = models.TextField(default="[]")