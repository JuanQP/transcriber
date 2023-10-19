from django.db import models
from django.contrib.auth.models import User

def audio_path(instance, filename):
    # File will be uploaded to MEDIA_ROOT/<project_id>/<filename>
    return f"{instance.project.id}/{filename}"

# Create your models here.
class Project(models.Model):
    """This is an `Audio` container class to keep your audios organized."""
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)

class Audio(models.Model):
    class TranscriptionStatus(models.TextChoices):
        PENDING = "PE", "Pending"
        FINISHED = "FI", "Finished"
        TRANSCRIBING = "TR", "Transcribing"

    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    """Project which contains this Audio"""
    file = models.FileField(upload_to=audio_path)
    """File of this Audio"""
    subtitles = models.FileField(upload_to=audio_path, default=None, null=True)
    """VTT subtitles file of this Audio"""
    status = models.CharField(
        max_length=2,
        choices=TranscriptionStatus.choices,
        default=TranscriptionStatus.PENDING,
    )
    """Transcription process status"""
    transcription = models.TextField(default="")
    """Result text of the transcription"""
