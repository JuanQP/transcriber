from django.contrib.postgres.search import SearchQuery
from django.db.models import F
from rest_framework import filters
import re

def words(search_text: str):
    return re.split(r"\s+", search_text.strip())

class TranscriptionSearch(filters.BaseFilterBackend):
    """
    FTS which depends on audio language
    """
    def filter_queryset(self, request, queryset, view):
        search = request.query_params.get("fts_search")

        if search is None or search == "":
            return queryset

        search_words = " | ".join(words(search))
        query = SearchQuery(search_words, search_type="raw", config=F("language"))

        return queryset.filter(transcription_vector=query)
