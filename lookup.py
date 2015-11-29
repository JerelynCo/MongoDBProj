import geocoder as gc
import json

MM_cities = ('Manila', 'Caloocan', 'Las Pinas', 'Makati', 'Malabon', 'Mandaluyong','Marikina', 'Muntinlupa', 'Navotas', 'Paranaque', 'Pasay', 'Pasig', 'Pateros', 'Quezon City', 'San Juan', 'Taguig', 'Valenzuela')

g_data = []

with open('MM_cities_collection.json', 'w') as outfile:
    for i in range(len(MM_cities)):
        g = gc.google(MM_cities[i]+', PH')
        northeast_coord = g.geojson['bbox']['northeast']
        southwest_coord = g.geojson['bbox']['southwest']

        data = {
        'city_name': MM_cities[i],
        'bounds': [
            {'corner':'upperLeft', 'lat': northeast_coord[0], 'lon': southwest_coord[1]}, #upper left
            {'corner':'upperRight', 'lat': northeast_coord[0], 'lon': northeast_coord[1]}, #upper right
            {'corner':'lowerRight', 'lat': southwest_coord[0], 'lon': northeast_coord[1]}, #lower right
            {'corner':'lowerLeft', 'lat': southwest_coord[0], 'lon': southwest_coord[1]} #lower left
            ]
        }
        g_data.append(data)
    json.dump(g_data, outfile)
