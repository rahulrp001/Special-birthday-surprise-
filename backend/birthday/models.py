from django.db import models


class BirthdayPerson(models.Model):
    """
    The single record describing the person the site is for.
    In the admin panel this is where you set her name, date of birth,
    profile photo, and the two long-form messages.

    Only one row is meant to exist — the admin is configured so a second
    one cannot be added by mistake.
    """
    name = models.CharField(
        max_length=100,
        help_text="Her name, used for login and displayed across the site."
    )
    date_of_birth = models.DateField(
        help_text="Used to verify login and to calculate the countdown."
    )
    profile_image = models.ImageField(
        upload_to='profile/', blank=True, null=True,
        help_text="Optional photo shown on the site."
    )
    birthday_message = models.TextField(
        help_text="The long personal message shown on the 'A Little Message For You' page."
    )
    final_message = models.TextField(
        help_text="The message revealed inside the envelope on the final surprise page."
    )
    background_music = models.FileField(
        upload_to='music/', blank=True, null=True,
        help_text="Optional background music file (mp3). Leave empty for no music."
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Birthday Person"
        verbose_name_plural = "Birthday Person"

    def __str__(self):
        return self.name


class Memory(models.Model):
    """One photo/memory shown in the 'Our Little Memories' gallery."""
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='memories/')
    memory_date = models.DateField(blank=True, null=True)
    order = models.PositiveIntegerField(
        default=0, help_text="Lower numbers appear first in the gallery."
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-memory_date', '-created_at']

    def __str__(self):
        return self.title


class Reason(models.Model):
    """One card in the 'Why You Are Special' section."""
    title = models.CharField(max_length=100, help_text="e.g. 'Your Smile'")
    description = models.CharField(
        max_length=300, help_text="A short sentence about this reason."
    )
    icon = models.CharField(
        max_length=10, default="✨",
        help_text="A single emoji shown on the card, e.g. 😊 🌸 💖"
    )
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return self.title
