from app.models import Audio, Project
from app.serializers import AudioSerializer, AudioCreateSerializer, ProjectSerializer
from rest_framework import mixins, viewsets

class AudioViewSet(
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Audio.objects.all()
    serializer_class = AudioSerializer

    def get_serializer_class(self):
        if self.action == "create":
            return AudioCreateSerializer

        return super().get_serializer_class()

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
