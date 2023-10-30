import re

from app.models import Audio
from celery import shared_task
from faster_whisper import WhisperModel
from functools import reduce

MODEL_SIZE = "medium"

# Add your languages here
# Faster-whisper returns "es" as a detected language which should
# be "spanish" in Postgres. The same goes with "en" which refers
# to "english". This is necesary to build a good index.
# If the detected language in a transcription is not in this list,
# it will default to "simple" index
WHISPER_TO_POSTGRES_LANGUAGES = {
    "es": Audio.Languages.SPANISH,
    "en": Audio.Languages.ENGLISH,
    "hi": Audio.Languages.HINDI,
}


def seconds_to_str(t: int) -> str:
    """function to convert floating point number of seconds to
    hh:mm:ss,sss

    https://stackoverflow.com/a/1384710/4792093
    """
    return "%02d:%02d:%02d.%03d" % \
        reduce(lambda ll,b : divmod(ll[0],b) + ll[1:],
            [(round(t*1000),),1000,60,60])

@shared_task
def transcribe(audio_id: int):
    audio = Audio.objects.get(id=audio_id)
    audio.status = Audio.TranscriptionStatus.TRANSCRIBING

    model = WhisperModel(MODEL_SIZE, device="cpu", compute_type="float32")
    segments, info = model.transcribe(audio.file.path, beam_size=5)
    audio.language = WHISPER_TO_POSTGRES_LANGUAGES.get(info.language) or Audio.Languages.OTHERS
    audio.save()

    audio.transcription = ""
    audio_vtt_fullpath = re.sub(r"\.\w+$", ".vtt", audio.file.path)
    audio_vtt_storage_path = re.sub(r"\.\w+$", ".vtt", audio.file.name)
    with open(audio_vtt_fullpath, "w") as vtt_file:
        vtt_file.write("WEBVTT\n\n")

        for segment in segments:
            text = segment.text
            # Transcription
            audio.transcription += text

            # VTT subtitles file
            start = seconds_to_str(segment.start)
            end = seconds_to_str(segment.end)
            vtt_file.write(f"{start} --> {end}\n")
            vtt_file.write(f"{text.strip()}\n\n")

    audio.subtitles = audio_vtt_storage_path
    audio.status = Audio.TranscriptionStatus.FINISHED
    audio.save()
