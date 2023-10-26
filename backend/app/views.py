from app import tasks
from app.models import Audio, Folder, Project
from app.serializers import (
    AudioCreateSerializer,
    AudioDetailSerializer,
    AudioListSerializer,
    FolderSerializer,
    FolderCreateSerializer,
    ProjectSerializer,
)
from app.permissions import IsOwner
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import decorators, filters, mixins, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

class AudioViewSet(
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Audio.objects.all()
    serializer_class = AudioListSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
    ]
    filterset_fields = [
        "project",
        "status",
    ]
    search_fields = ["transcription"]

    def get_serializer_class(self):
        if self.action == "create":
            return AudioCreateSerializer
        elif self.action == "retrieve":
            return AudioDetailSerializer

        return super().get_serializer_class()

    def perform_create(self, serializer):
        folder = serializer.validated_data["folder"]
        if folder.project.owner != self.request.user:
            raise PermissionDenied("You don't have permissions on this project to upload files")

        new_audio = serializer.save(
            project = folder.project,
        )
        tasks.transcribe.apply_async(args=[new_audio.id])

    @decorators.action(methods=["POST"], detail=True)
    def reprocess(self, request, pk=None):
        audio: Audio = self.get_object()
        tasks.transcribe.apply_async(args=[audio.id])

        return Response({"message": "Audio will be transcribed"})

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]
    permission_classes = [
        IsAuthenticated,
        IsOwner,
    ]

    def perform_create(self, serializer):
        new_project = serializer.save(owner=self.request.user)
        Folder.objects.create(
            name=str(new_project.id),
            project=new_project,
            parent_folder=None,
        )

class FolderViewSet(viewsets.ModelViewSet):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = [
        "project",
        "parent_folder",
    ]

    def get_serializer_class(self):
        if self.action == "create":
            return FolderCreateSerializer
        return super().get_serializer_class()

    def perform_create(self, serializer):
        project = serializer.validated_data["parent_folder"].project
        if project.owner != self.request.user:
            raise PermissionDenied("You don't have permissions on this project to create folders")
        serializer.save(project=project)
