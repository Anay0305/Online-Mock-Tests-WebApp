from django.contrib import admin

from API.models import Attempt, TestIds, TestStatus
admin.site.register(Attempt)
admin.site.register(TestIds)
admin.site.register(TestStatus)