# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2016-12-26 02:34
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('good_weather', '0005_auto_20161224_2018'),
    ]

    operations = [
        migrations.CreateModel(
            name='Ticket',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('origin', models.CharField(max_length=3)),
                ('destination', models.CharField(max_length=3)),
                ('price', models.IntegerField()),
            ],
        ),
    ]
