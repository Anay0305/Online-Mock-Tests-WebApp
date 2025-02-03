from django.contrib import admin
from API.models import Attempt, Test, CurrentTest, Questions, UserAnswers, Results

class CurrentTestAdmin(admin.ModelAdmin):
    readonly_fields = ('user', 'created_at',)
    list_display = ('user', 'test_started', 'created_at')

class QuestionsAdmin(admin.ModelAdmin):
    readonly_fields = ('Subject', 'Number',)
    list_display = ('test_name', 'Subject', 'Type', 'Number')

class UserAnswersAdmin(admin.ModelAdmin):
    readonly_fields = ('user', 'Subject',)
    list_display = ('user', 'Subject', 'Attempt')

class ResultsAdmin(admin.ModelAdmin):
    readonly_fields = ('user', 'TotalMarks',)
    list_display = ('user', 'TotalMarks')

class TestAdmin(admin.ModelAdmin):
    def has_change_permission(self, request, obj=None):
        return False
    readonly_fields = ('Total',)

admin.site.register(Attempt)
admin.site.register(CurrentTest, CurrentTestAdmin)
admin.site.register(Test, TestAdmin)
admin.site.register(Questions, QuestionsAdmin)
admin.site.register(UserAnswers, UserAnswersAdmin)
admin.site.register(Results, ResultsAdmin)