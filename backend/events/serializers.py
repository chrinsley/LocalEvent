from rest_framework import serializers
from .models import Category, Event, User

class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'is_staff']

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            username=validated_data['username'],
            is_staff=validated_data['is_staff'],
            
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            username=validated_data['username'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'label', 'description', 'icon', 'gradient']


class EventSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='pk', read_only=True)
    category = serializers.SlugRelatedField(
        slug_field='id',
        queryset=Category.objects.all(),
    )
    time = serializers.TimeField(format='%H:%M')

    class Meta:
        model = Event
        fields = [
            'id',
            'title',
            'description',
            'category',
            'date',
            'time',
            'venue',
            'city',
            'image',
            'source',
            'price',
            'attendees',
            'featured',
        ]
