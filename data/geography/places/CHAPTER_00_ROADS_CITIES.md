# Chapter 00 cities and freeways

Los Angeles and San Diego are approximate downtown reference dots. Major Roads uses Census TIGER Transportation layer 2, MTFCC S1100 primary limited-access roads (January 2026). This is modern reference geography, not a reconstruction of the 1965 freeway network.

Source: https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Transportation/MapServer/2

Display JSON: CHAPTER_00_ROADS_CITIES.json. Full retrieved geometry preserved locally in data/local/chapter00-tiger-roads-original.json. Display geometry is simplified; 400 m or shorter rendering segments fade from 10 miles to zero at 20 miles from the nearest city. Both layers default on in Chapter 00 and can be toggled separately. No street or ramp layer is included.
