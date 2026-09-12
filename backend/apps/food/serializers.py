from rest_framework import serializers

from .models import FoodListing


class FoodListingSerializer(serializers.ModelSerializer):
    provider_username = serializers.CharField(source="provider.username", read_only=True)
    provider_phone = serializers.CharField(source="provider.phone", read_only=True)
    requester_username = serializers.CharField(source="requester.username", read_only=True, default=None)
    requester_phone = serializers.CharField(source="requester.phone", read_only=True, default=None)
    volunteer_username = serializers.CharField(source="volunteer.username", read_only=True, default=None)

    class Meta:
        model = FoodListing
        fields = (
            "id", "provider", "provider_username", "provider_phone", "title", "description",
            "quantity_servings", "expiry_time", "status", "requester",
            "requester_username", "requester_phone", "volunteer", "volunteer_username",
            "address_text", "lat", "lng", "created_at", "updated_at", "completed_at",
        )
        read_only_fields = (
            "id", "provider", "status", "requester", "volunteer",
            "created_at", "updated_at", "completed_at",
        )
