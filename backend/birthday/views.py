from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from datetime import date
import os

from .models import BirthdayPerson, Memory, Reason
from .serializers import (
    LoginSerializer, BirthdayPersonSerializer,
    MemorySerializer, ReasonSerializer,
)


def _check_admin(request):
    password = request.headers.get('X-Admin-Password', '')
    return password == os.getenv('ADMIN_PASSWORD', 'admin123')


def _get_person():
    """Returns the single BirthdayPerson row, or None if not configured yet."""
    return BirthdayPerson.objects.first()


@api_view(['POST'])
def login_view(request):
    """
    POST /api/login/
    Body: { "username": "...", "date_of_birth": "YYYY-MM-DD" }

    Validates the submitted name + DOB against the record stored in the
    database. Never reveals which field was wrong.
    """
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(
            {
                'success': False,
                'message': "Oops! This little surprise is only for you ❤️",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    person = _get_person()
    if person is None:
        return Response(
            {
                'success': False,
                'message': "The surprise isn't ready yet. Please check back soon.",
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    submitted_name = serializer.validated_data['username'].strip().lower()
    submitted_dob = serializer.validated_data['date_of_birth']

    name_matches = submitted_name == person.name.strip().lower()
    dob_matches = submitted_dob == person.date_of_birth

    if name_matches and dob_matches:
        return Response({
            'success': True,
            'message': f'Welcome, {person.name}!',
            'name': person.name,
        })

    return Response(
        {
            'success': False,
            'message': "Oops! This little surprise is only for you ❤️",
        },
        status=status.HTTP_401_UNAUTHORIZED,
    )


@api_view(['GET'])
def birthday_view(request):
    """GET /api/birthday/ — her name, messages and media."""
    person = _get_person()
    if person is None:
        return Response(
            {'message': 'Nothing configured yet. Add a Birthday Person in the admin panel.'},
            status=status.HTTP_404_NOT_FOUND,
        )
    serializer = BirthdayPersonSerializer(person, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def memories_view(request):
    """GET /api/memories/ — the photo gallery."""
    memories = Memory.objects.all()
    serializer = MemorySerializer(memories, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def reasons_view(request):
    """GET /api/reasons/ — the 'Why You Are Special' cards."""
    reasons = Reason.objects.all()
    serializer = ReasonSerializer(reasons, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def messages_view(request):
    """GET /api/messages/ — just the two written messages."""
    person = _get_person()
    if person is None:
        return Response(
            {'message': 'Nothing configured yet.'},
            status=status.HTTP_404_NOT_FOUND,
        )
    return Response({
        'birthday_message': person.birthday_message,
        'final_message': person.final_message,
    })


@api_view(['GET'])
def countdown_view(request):
    """
    GET /api/countdown/ — the next occurrence of her birthday, as an ISO
    datetime, so the frontend never has to hardcode the date.
    """
    person = _get_person()
    if person is None:
        return Response(
            {'message': 'Nothing configured yet.'},
            status=status.HTTP_404_NOT_FOUND,
        )

    today = date.today()
    dob = person.date_of_birth
    next_birthday = date(today.year, dob.month, dob.day)
    if next_birthday < today:
        next_birthday = date(today.year + 1, dob.month, dob.day)

    return Response({
        'name': person.name,
        'next_birthday': next_birthday.isoformat(),
    })


# ── Admin endpoints ──────────────────────────────────────────────────────────

@api_view(['POST'])
def admin_login_view(request):
    """POST /api/admin/login/ — verify admin password."""
    password = request.data.get('password', '')
    if password == os.getenv('ADMIN_PASSWORD', 'admin123'):
        return Response({'success': True})
    return Response({'success': False, 'message': 'Wrong password'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET', 'PUT'])
def admin_birthday_view(request):
    """GET/PUT /api/admin/birthday/ — read or update birthday person info."""
    if not _check_admin(request):
        return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    person = _get_person()
    if request.method == 'GET':
        if person is None:
            return Response({})
        serializer = BirthdayPersonSerializer(person, context={'request': request})
        return Response(serializer.data)

    # PUT
    if person is None:
        return Response({'message': 'No birthday person configured yet.'}, status=status.HTTP_404_NOT_FOUND)

    data = request.data
    if 'name' in data:
        person.name = data['name']
    if 'date_of_birth' in data:
        person.date_of_birth = data['date_of_birth']
    if 'birthday_message' in data:
        person.birthday_message = data['birthday_message']
    if 'final_message' in data:
        person.final_message = data['final_message']
    if 'profile_image' in request.FILES:
        person.profile_image = request.FILES['profile_image']
    if 'background_music' in request.FILES:
        person.background_music = request.FILES['background_music']
    person.save()
    serializer = BirthdayPersonSerializer(person, context={'request': request})
    return Response(serializer.data)


@api_view(['GET', 'POST'])
def admin_memories_view(request):
    """GET /api/admin/memories/ — list all. POST — add new memory."""
    if not _check_admin(request):
        return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    if request.method == 'GET':
        memories = Memory.objects.all()
        serializer = MemorySerializer(memories, many=True, context={'request': request})
        return Response(serializer.data)

    # POST
    title = request.data.get('title', '').strip()
    image = request.FILES.get('image')
    if not title or not image:
        return Response({'message': 'title and image are required'}, status=status.HTTP_400_BAD_REQUEST)
    memory = Memory.objects.create(
        title=title,
        description=request.data.get('description', ''),
        image=image,
        memory_date=request.data.get('memory_date') or None,
    )
    serializer = MemorySerializer(memory, context={'request': request})
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
def admin_memory_delete_view(request, pk):
    """DELETE /api/admin/memories/<pk>/"""
    if not _check_admin(request):
        return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        Memory.objects.get(pk=pk).delete()
        return Response({'success': True})
    except Memory.DoesNotExist:
        return Response({'message': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET', 'POST'])
def admin_reasons_view(request):
    """GET /api/admin/reasons/ — list all. POST — add new reason."""
    if not _check_admin(request):
        return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    if request.method == 'GET':
        reasons = Reason.objects.all()
        serializer = ReasonSerializer(reasons, many=True)
        return Response(serializer.data)

    # POST
    title = request.data.get('title', '').strip()
    description = request.data.get('description', '').strip()
    if not title or not description:
        return Response({'message': 'title and description are required'}, status=status.HTTP_400_BAD_REQUEST)
    reason = Reason.objects.create(
        title=title,
        description=description,
        icon=request.data.get('icon', '✨'),
    )
    return Response(ReasonSerializer(reason).data, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
def admin_reason_delete_view(request, pk):
    """DELETE /api/admin/reasons/<pk>/"""
    if not _check_admin(request):
        return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        Reason.objects.get(pk=pk).delete()
        return Response({'success': True})
    except Reason.DoesNotExist:
        return Response({'message': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def admin_change_password_view(request):
    """POST /api/admin/change-password/ — change admin password and save to .env"""
    if not _check_admin(request):
        return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    new_password = request.data.get('new_password', '').strip()
    if not new_password or len(new_password) < 4:
        return Response({'message': 'Password must be at least 4 characters'}, status=status.HTTP_400_BAD_REQUEST)

    # Update .env file
    from pathlib import Path
    env_path = Path(__file__).resolve().parent.parent.parent / '.env'
    try:
        lines = env_path.read_text().splitlines()
        new_lines = []
        found = False
        for line in lines:
            if line.startswith('ADMIN_PASSWORD='):
                new_lines.append(f'ADMIN_PASSWORD={new_password}')
                found = True
            else:
                new_lines.append(line)
        if not found:
            new_lines.append(f'ADMIN_PASSWORD={new_password}')
        env_path.write_text('\n'.join(new_lines) + '\n')
        # Update in-memory env so it works immediately without restart
        os.environ['ADMIN_PASSWORD'] = new_password
        return Response({'success': True})
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
