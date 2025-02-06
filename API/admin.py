from django.contrib import admin
from API.models import Attempt, Test, CurrentTest, Section, Questions, UserAnswers, Results

class CurrentTestAdmin(admin.ModelAdmin):
    def has_change_permission(self, request, obj=None):
        return False
    readonly_fields = ('Test', 'user', 'created_at',)
    list_display = ('user', 'test_name', 'test_started', 'created_at')

class QuestionsAdmin(admin.ModelAdmin):
    def has_add_permission(self, request, obj=None):
        return False
    def has_delete_permission(self, request, obj=None):
        if obj and obj.Test is not None:
            return True
        return False
    readonly_fields = ('Test', 'Type', 'Subject', 'Number',)
    list_display = ('test_name', 'Subject', 'Type', 'Number')

class SectionAdmin(admin.ModelAdmin):
    def has_add_permission(self, request, obj=None):
        return False
    def has_delete_permission(self, request, obj=None):
        if obj and obj.Test is not None:
            return True
        return False
    readonly_fields = ('Test', 'Type', 'Number', )
    list_display = ('test_name', 'Type', 'Number')

class UserAnswersAdmin(admin.ModelAdmin):
    def has_add_permission(self, request, obj=None):
        return False
    def has_delete_permission(self, request, obj = ...):
        return False
    readonly_fields = ('Test', 'user', 'Subject',)
    list_display = ('user', 'test_name', 'Subject', 'Attempt')

class ResultsAdmin(admin.ModelAdmin):
    def has_add_permission(self, request, obj=None):
        return False
    def has_delete_permission(self, request, obj = ...):
        return False
    readonly_fields = ('Test', 'user', 'TotalMarks',)
    list_display = ('user', 'test_name', 'TotalMarks')

class TestAdmin(admin.ModelAdmin):
    def has_change_permission(self, request, obj=None):
        return False    
    def has_delete_permission(self, request, obj=None):
        return True  # Allow Test deletion
    readonly_fields = ('Total',)

admin.site.register(Test, TestAdmin)
admin.site.register(Section, SectionAdmin)
admin.site.register(Questions, QuestionsAdmin)
admin.site.register(CurrentTest, CurrentTestAdmin)
admin.site.register(UserAnswers, UserAnswersAdmin)
admin.site.register(Attempt)
admin.site.register(Results, ResultsAdmin)