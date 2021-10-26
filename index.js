import "@babel/polyfill";
import $79KLA$axios from "axios";



const $c430d121daf23ad7$export$de026b00723010c1 = (type, message)=>{
    $c430d121daf23ad7$export$516836c6a9dfc573();
    const markup = `
        <div class="alert alert--${type}"> ${message} </div>
    `;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    setTimeout($c430d121daf23ad7$export$516836c6a9dfc573, 5000);
};
const $c430d121daf23ad7$export$516836c6a9dfc573 = ()=>{
    const alert = document.querySelector('.alert');
    if (alert) alert.remove();
};


const $c29fe3e4627a4397$export$596d806903d1f59e = async (email, password)=>{
    try {
        const res = await $79KLA$axios({
            method: 'post',
            url: 'http://localhost:5000/api/v1/users/login',
            data: {
                email: email,
                password: password
            }
        });
        if (res.data.status === 'success') {
            $c430d121daf23ad7$export$de026b00723010c1('success', 'Logged in successfully');
            window.setTimeout(()=>{
                location.assign('/');
            }, 1500);
        }
    } catch (error) {
        $c430d121daf23ad7$export$de026b00723010c1('error', error.response.data.message);
    }
};


function $4cc415faee924028$export$2e2bcd8739ae039(locations) {
    mapboxgl.accessToken = 'pk.eyJ1IjoicmFoYXQ0NyIsImEiOiJja3YzemM1bXUwaXQ2Mm5waGRvc2lxejFwIn0.uv1f-__4h-6T_lnCe_FQFw';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/rahat47/ckv402emd2hoj15mpyiibmts2',
        scrollZoom: false
    });
    // make sure the map is fully loaded before adding the line
    map.on('load', ()=>{
        // Create bounds
        const bounds = new mapboxgl.LngLatBounds();
        locations.forEach((loc)=>{
            // Add a marker
            const el = document.createElement('div');
            el.className = 'marker';
            // Add marker
            new mapboxgl.Marker({
                element: el,
                anchor: 'bottom'
            }).setLngLat(loc.coordinates).addTo(map);
            // Add popup
            new mapboxgl.Popup({
                offset: 30
            }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map);
            bounds.extend(loc.coordinates);
        });
        map.fitBounds(bounds, {
            padding: {
                top: 200,
                bottom: 200,
                left: 100,
                right: 100
            }
        });
        // join each location with a line
        const route = locations.map((loc)=>loc.coordinates
        );
        // add the line to the map
        map.addLayer({
            id: 'route',
            type: 'line',
            source: {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {
                    },
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


// Get the form for login page
const $25f54650620fced4$var$form = document.querySelector('.form');
// get the map from the DOM
const $25f54650620fced4$var$map = document.getElementById('map');
// get the locations from the map data
const $25f54650620fced4$var$tourLocations = $25f54650620fced4$var$map ? JSON.parse($25f54650620fced4$var$map.dataset.locations) : [];
if ($25f54650620fced4$var$tourLocations.length) $4cc415faee924028$export$2e2bcd8739ae039($25f54650620fced4$var$tourLocations);
if ($25f54650620fced4$var$form) $25f54650620fced4$var$form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    $c29fe3e4627a4397$export$596d806903d1f59e(email, password);
});


//# sourceMappingURL=index.js.map
