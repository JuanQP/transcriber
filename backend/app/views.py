from app import tasks
from app.models import Audio, Project
from app.serializers import AudioSerializer, AudioCreateSerializer, ProjectSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import decorators, filters, mixins, viewsets
from rest_framework.response import Response

class AudioViewSet(
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Audio.objects.all()
    serializer_class = AudioSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = [
        "project",
        "status",
    ]

    def get_serializer_class(self):
        if self.action == "create":
            return AudioCreateSerializer

        return super().get_serializer_class()

    def perform_create(self, serializer):
        new_audio = serializer.save()
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


    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
