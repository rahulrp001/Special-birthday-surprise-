from django.contrib import admin
from .models import BirthdayPerson, Memory, Reason


@admin.register(BirthdayPerson)
class BirthdayPersonAdmin(admin.ModelAdmin):
    list_display = ('name', 'date_of_birth')
    fieldsets = (
        ('Login credentials', {
            'fields': ('name', 'date_of_birth'),
            'description': 'These two fields must match exactly what she types on the login page.',
        }),
        ('Photo & music', {
            'fields': ('profile_image', 'background_music'),
        }),
        ('Messages', {
            'fields': ('birthday_message', 'final_message'),
        }),
    )

    def has_add_permission(self, request):
        # Only one BirthdayPerson row should ever exist.
        return not BirthdayPerson.objects.exists()


@admin.register(Memory)
class MemoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'memory_date', 'order')
    list_editable = ('order',)
    ordering = ('order', '-memory_date')


@admin.register(Reason)
class ReasonAdmin(admin.ModelAdmin):
    list_display = ('title', 'icon', 'order')
    list_editable = ('order',)
    ordering = ('order',)
