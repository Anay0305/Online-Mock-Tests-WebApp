from django.db import models

class Attempt(models.Model):
    username = models.TextField(primary_key=True)
    data = models.JSONField(default=dict)

class TestIds(models.Model):
    data = models.JSONField(default=list)