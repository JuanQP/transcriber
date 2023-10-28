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

    @property
    def root_folder(self):
        return self.folders.filter(parent_folder__isnull=True).first()

class Folder(models.Model):
    """Folder in which every audio will be stored"""
    name = models.CharField(max_length=200)
    parent_folder = models.ForeignKey(
        "Folder",
        related_name="children",
        null=True,
        default=None,
        on_delete=models.CASCADE,
    )
    project = models.ForeignKey(
        Project,
        related_name="folders",
        on_delete=models.CASCADE,
    )

class Audio(models.Model):
    class TranscriptionStatus(models.TextChoices):
        PENDING = "PE", "Pending"
        FINISHED = "FI", "Finished"
        TRANSCRIBING = "TR", "Transcribing"

    project = models.ForeignKey(
        Project,
        related_name="audios",
        on_delete=models.CASCADE,
    )
    """Project which contains this Audio"""
    folder = models.ForeignKey(
        Folder,
        related_name="files",
        on_delete=models.CASCADE,
    )
    """Container folder of this Audio"""
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
