I had some spare time the weekend and decided to make some pet-project or a micro-hackathon for myself. And there was no sunny weather in Moscow for a couple of months at the moment.

Parced city coordinates from map.aviasales.ru

Enriched it with the weather data taken from openweathermap.org

Plotted it on google maps as a heatmap, looks pretty - https://goo.gl/VXQYC6 but not very useful - color distribution is more affected by the dots closeness, not by their temperature.

Tried to plot it as colored cirlces calculating color as a HSL gradient, looks fine too, but too laggy with 3K points.

For such cases google maps have a cool feature currently is alpha-version - Fusion Tables. Uploaded my data to it, plotted - super, not lags. https://goo.gl/zQ1mft  Fusion Tables web-interface also allows to customize markers for data ranges. Not too flexible, may be that's because of alpha-state, there are hacky workarounds in JS but that's enough for me now. https://goo.gl/06Ixqw

Again parsed map.aviasales.ru for the round-trip tickets prices, filtered results slightly: `places = [place for place in Place.objects.all() if 17 <= place.weather['temp'] < 25 and place.price and place.price < 20000]`

And with an ugly JS added it as a second layer of custom markers to the map: https://goo.gl/8BBTLd

Wrapped the whole project with Docker (django, uwsgi, nginx, postgres in a single container), rolled it out on my VPS in Netherlands, done!:)

result: http://catchthesummer.scythargon.ru

sources: https://github.com/scythargon/catch_the_summer

time spent: less than 15 hours

pity that aviasales.ru/calendar does not accept GET-parameters:)
