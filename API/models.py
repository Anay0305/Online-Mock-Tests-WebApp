from django.db import models
from django.contrib.auth.models import User

class TestStatus(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    test_id = models.IntegerField()
    test_started = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - Test {self.test_id}"

class Attempt(models.Model):
    username = models.TextField(primary_key=True)
    data = models.JSONField(default=dict)

class TestIds(models.Model):
    data = models.JSONField(default=list)