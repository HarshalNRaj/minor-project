from rest_framework import serializers

from .models import Resource


class ResourceSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source="owner.username", read_only=True)
    requester_username = serializers.CharField(source="requester.username", read_only=True, default=None)
    volunteer_username = serializers.CharField(source="volunteer.username", read_only=True, default=None)
    photo = serializers.SerializerMethodField()

    def get_photo(self, obj):
        if not obj.photo:
            return None
        request = self.context.get("request")
        return request.build_absolute_uri(obj.photo.url) if request else obj.photo.url

    class Meta:
        model = Resource
        fields = (
            "id", "owner", "owner_username", "title", "category", "condition",
            "description", "quantity", "status", "requester", "requester_username",
            "volunteer", "volunteer_username", "address_text", "contact_phone", "photo", "lat", "lng",
            "created_at", "updated_at", "completed_at",
        )
        read_only_fields = (
            "id", "owner", "status", "requester", "volunteer",
            "created_at", "updated_at", "completed_at",
        )
