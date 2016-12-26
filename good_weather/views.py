from django.http import HttpResponse
from django.shortcuts import render
from django.conf import settings
import json
import os

from .models import *


def index(request):
    places = Place.objects.all()
    weather=[round(p.temp) for p in Place.objects.all()]
    min_temp, max_temp = min(weather), max(weather)
    return render(request, 'fusion.html', locals())

def data(request):
    """
    {
      "features": [
        {
          "geometry": {
            "coordinates": [
              -124.4685,
              40.3087,
              8.7
            ],
            "type": "Point"
          },
          "properties": {
            "mag": 3.3
          },
          "type": "Feature"
        },
        {
          "geometry": {
            "coordinates": [
              -140.8051,
              61.5171,
              8.8
            ],
            "type": "Point"
          },
          "properties": {
            "mag": 2.3
          },
          "type": "Feature"
        }
      ],
      "type": "FeatureCollection"
    }

    """
    # with open(os.path.join(settings.BASE_DIR, 'assets/3.json')) as le_file:
    #     content = le_file.read()
    # return HttpResponse("eqfeed_callback(%s);" % content)
    features = []
    places = [place for place in Place.objects.all() if 17 <= place.weather['temp'] < 25 and place.price and place.price < 20000]
    for place in places:
        features.append({
          "geometry": {
            "coordinates": [
              place.coordinates.x,
              place.coordinates.y
            ],
            "type": "Point"
          },
          "properties": {
            "temp": place.temp,
            "price": place.price,
            "name": place.name,
            "iata": place.iata,
          },
          "type": "Feature"
        })
    data = {
        "type": "FeatureCollection",
        "features": features
    }
    return HttpResponse("eqfeed_callback(%s);" % json.dumps(data))
