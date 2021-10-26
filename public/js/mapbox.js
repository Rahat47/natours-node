export default function initMap(locations) {
    mapboxgl.accessToken = 'pk.eyJ1IjoicmFoYXQ0NyIsImEiOiJja3YzemM1bXUwaXQ2Mm5waGRvc2lxejFwIn0.uv1f-__4h-6T_lnCe_FQFw';

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/rahat47/ckv402emd2hoj15mpyiibmts2',
        scrollZoom: false,
    });


    // make sure the map is fully loaded before adding the line
    map.on('load', () => {
        // Create bounds
        const bounds = new mapboxgl.LngLatBounds();

        locations.forEach(loc => {
            // Add a marker
            const el = document.createElement('div');
            el.className = 'marker';

            // Add marker
            new mapboxgl.Marker({
                element: el,
                anchor: 'bottom'
            })
                .setLngLat(loc.coordinates)
                .addTo(map);

            // Add popup
            new mapboxgl.Popup({
                offset: 30
            })
                .setLngLat(loc.coordinates)
                .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
                .addTo(map);

            bounds.extend(loc.coordinates);
        })

        map.fitBounds(bounds, {
            padding: {
                top: 200,
                bottom: 200,
                left: 100,
                right: 100
            }
        });

        // join each location with a line
        const route = locations.map(loc => loc.coordinates);

        // add the line to the map
        map.addLayer({
            id: 'route',
            type: 'line',
            source: {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: route
                    }
                }
            },
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#888',
                'line-width': 8
            }
        });

        // Add zoom and rotation controls to the map.
        map.addControl(new mapboxgl.NavigationControl());


        // Add geolocate control to the map.
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        }));

    });

}

