from django.conf import settings
from rest_framework import serializers
from .models import Category, Event, User, Booking

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


class CurrentUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)

        for attribute, value in validated_data.items():
            setattr(instance, attribute, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance

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
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        if not obj.image:
            return ''

        image_name = str(obj.image.name)

        # print("IMAGE:", repr(image_name))

        # External URL
        if image_name.startswith('http://') or image_name.startswith('https://'):
            return image_name

        # Local uploaded image
        request = self.context.get('request')

        if request:
            return request.build_absolute_uri(obj.image.url)

        return f"{settings.MEDIA_URL}{image_name}"

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


class BookingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    event = serializers.PrimaryKeyRelatedField(
        queryset=Event.objects.all()
    )

    class Meta:
        model = Booking
        fields = ['id', 'user', 'event', 'date']
        read_only_fields = ['id', 'user', 'date']

    # def create(self, validated_data):
    #     user = validated_data['user']['username']
    #     if (Booking.objects.filter(user=user).exists()):
    #         return serializers.ValidationError("object already exist")
    #     return super().create(validated_data)


class ViewBookingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    event = EventSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'user', 'event', 'date']
        read_only_fields = ['id', 'user', 'date']