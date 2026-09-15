from rest_framework import serializers

from .models import FoodListing


class FoodListingSerializer(serializers.ModelSerializer):
    provider_username = serializers.CharField(source="provider.username", read_only=True)
    requester_username = serializers.CharField(source="requester.username", read_only=True, default=None)
    volunteer_username = serializers.CharField(source="volunteer.username", read_only=True, default=None)
    photo = serializers.SerializerMethodField()

    def get_photo(self, obj):
        if not obj.photo:
            return None
        request = self.context.get("request")
        return request.build_absolute_uri(obj.photo.url) if request else obj.photo.url

    class Meta:
        model = FoodListing
        fields = (
            "id", "provider", "provider_username", "title", "description",
            "quantity_servings", "expiry_time", "status", "requester",
            "requester_username", "volunteer", "volunteer_username",
            "address_text", "contact_phone", "photo", "lat", "lng", "created_at", "updated_at", "completed_at",
        )
        read_only_fields = (
            "id", "provider", "status", "requester", "volunteer",
            "created_at", "updated_at", "completed_at",
        )
