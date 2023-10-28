from rest_framework import serializers
from app.models import Audio, Folder, Project

class ProjectSerializer(serializers.ModelSerializer):
    root_folder = serializers.PrimaryKeyRelatedField(read_only=True)
    audio_count = serializers.SerializerMethodField()
    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "root_folder",
            "owner",
            "audio_count",
        ]
        read_only_fields = [
            "root_folder",
            "owner",
        ]

    def get_audio_count(self, obj):
        return obj.audios.count()

class ProjectSerializer(serializers.ModelSerializer):
    root_folder = serializers.PrimaryKeyRelatedField(read_only=True)
    audio_count = serializers.IntegerField(source="audios.count", read_only=True)
    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "root_folder",
            "owner",
            "audio_count",
        ]
        read_only_fields = [
            "root_folder",
            "owner",
        ]

class AudioListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audio
        fields = [
            "id",
            "project",
            "folder",
            "file",
            "status",
        ]
        read_only_fields = [
            "__all__"
        ]

class AudioDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audio
        fields = [
            "id",
            "project",
            "folder",
            "file",
            "status",
            "subtitles",
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
            "folder",
            "file",
        ]
        read_only_fields = ["project"]

class FolderLeafSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder
        fields = [
            "id",
            "name",
        ]

class FolderSerializer(serializers.ModelSerializer):
    children = FolderLeafSerializer(many=True, read_only=True)
    project_name = serializers.StringRelatedField(source="project.name")
    class Meta:
        model = Folder
        fields = [
            "id",
            "name",
            "children",
            "project_name",
            "project",
        ]
        read_only_fields = [
            "project",
        ]

class FolderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder
        fields = [
            "id",
            "name",
            "project",
            "parent_folder",
        ]
        read_only_fields = ["project"]
