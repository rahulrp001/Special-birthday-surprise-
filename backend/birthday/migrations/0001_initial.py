from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='BirthdayPerson',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='Her name, used for login and displayed across the site.', max_length=100)),
                ('date_of_birth', models.DateField(help_text='Used to verify login and to calculate the countdown.')),
                ('profile_image', models.ImageField(blank=True, help_text='Optional photo shown on the site.', null=True, upload_to='profile/')),
                ('birthday_message', models.TextField(help_text="The long personal message shown on the 'A Little Message For You' page.")),
                ('final_message', models.TextField(help_text='The message revealed inside the envelope on the final surprise page.')),
                ('background_music', models.FileField(blank=True, help_text='Optional background music file (mp3). Leave empty for no music.', null=True, upload_to='music/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Birthday Person',
                'verbose_name_plural': 'Birthday Person',
            },
        ),
        migrations.CreateModel(
            name='Memory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=150)),
                ('description', models.TextField(blank=True)),
                ('image', models.ImageField(upload_to='memories/')),
                ('memory_date', models.DateField(blank=True, null=True)),
                ('order', models.PositiveIntegerField(default=0, help_text='Lower numbers appear first in the gallery.')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['order', '-memory_date', '-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Reason',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(help_text="e.g. 'Your Smile'", max_length=100)),
                ('description', models.CharField(help_text='A short sentence about this reason.', max_length=300)),
                ('icon', models.CharField(default='✨', help_text='A single emoji shown on the card, e.g. 😊 🌸 💖', max_length=10)),
                ('order', models.PositiveIntegerField(default=0)),
            ],
            options={
                'ordering': ['order', 'id'],
            },
        ),
    ]
