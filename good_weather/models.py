from django.contrib.gis.db import models
from django.contrib.gis.geos import fromstr
from django.contrib.postgres.fields import JSONField


class Place(models.Model):
    name = models.CharField(max_length=255)
    name_en = models.CharField(max_length=255, default='')
    country_code = models.CharField(max_length=2)
    iata = models.CharField(max_length=3)
    coordinates = models.PointField(geography=True, null=True)
    weather = JSONField(default=[])
    last_updated = models.DateTimeField(null=True, auto_now=True)

    @property
    def temp(self):
        return round(self.weather['temp'])

    @property
    def price(self):
        tickets = Ticket.objects.filter(destination=self.iata)
        return tickets[0].price if tickets else None


    objects = models.GeoManager()

    def __str__(self):
        return "%s: %s" % (self.country_code, self.name)


class Country(models.Model):
    code = models.CharField(max_length=2)
    name = models.CharField(max_length=255)

class Ticket(models.Model):
    origin = models.CharField(max_length=3)
    destination = models.CharField(max_length=3)
    price = models.IntegerField()
