from app.models import Audio, Project
from app.serializers import AudioSerializer, AudioCreateSerializer, ProjectSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, mixins, viewsets

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

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]


    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
