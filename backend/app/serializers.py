from rest_framework import serializers
from app.models import Audio, Project

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "owner",
        ]
        read_only_fields = [
            "owner",
        ]

class AudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audio
        fields = [
            "id",
            "project",
            "file",
            "subtitles",
            "status",
            "transcription",
        ]
        read_only_fields = [
            "__all__"
        ]

class AudioCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audio
        fields = [
            "id",
            "project",
            "file",
        ]
