from rest_framework import serializers
from app.models import Audio, Folder, Project

class ProjectSerializer(serializers.ModelSerializer):
    root_folder = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "root_folder",
            "owner",
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
            "file",
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
    files = AudioListSerializer(many=True, read_only=True)
    children = FolderLeafSerializer(many=True, read_only=True)
    class Meta:
        model = Folder
        fields = [
            "id",
            "name",
            "children",
            "files",
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
