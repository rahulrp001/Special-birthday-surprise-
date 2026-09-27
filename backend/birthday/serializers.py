from rest_framework import serializers
from .models import BirthdayPerson, Memory, Reason


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    date_of_birth = serializers.DateField()


class BirthdayPersonSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()
    background_music = serializers.SerializerMethodField()

    def _abs(self, file_field):
        if not file_field:
            return None
        request = self.context.get('request')
        return request.build_absolute_uri(file_field.url) if request else file_field.url

    def get_profile_image(self, obj):
        return self._abs(obj.profile_image)

    def get_background_music(self, obj):
        return self._abs(obj.background_music)

    class Meta:
        model = BirthdayPerson
        fields = [
            'name', 'profile_image', 'birthday_message',
            'final_message', 'background_music', 'date_of_birth',
        ]


class MemorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.image.url) if request else obj.image.url

    class Meta:
        model = Memory
        fields = ['id', 'title', 'description', 'image', 'memory_date']


class ReasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reason
        fields = ['id', 'title', 'description', 'icon']
