from django.contrib import admin
from app import models

# Register your models here.
@admin.register(models.Project)
class ProjectAdmin(admin.ModelAdmin):
    pass

@admin.register(models.Audio)
class AudioAdmin(admin.ModelAdmin):
    pass
