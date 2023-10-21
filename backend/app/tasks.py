from app.models import Audio
from celery import shared_task
from faster_whisper import WhisperModel

MODEL_SIZE = "medium"

@shared_task
def transcribe(audio_id: int):
    audio = Audio.objects.get(id=audio_id)
    audio.status = Audio.TranscriptionStatus.TRANSCRIBING
    audio.save()

    model = WhisperModel(MODEL_SIZE, device="cpu", compute_type="float32")
    segments, _ = model.transcribe(audio.file.path, beam_size=5)

    audio.transcription = ""
    for segment in segments:
        audio.transcription += segment.text

    audio.status = Audio.TranscriptionStatus.FINISHED
    audio.save()
