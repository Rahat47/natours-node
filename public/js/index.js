import '@babel/polyfill';
import { login } from "./login";
import initMap from './mapbox';

// Get the form for login page
const form = document.querySelector('.form');

// get the map from the DOM
const map = document.getElementById('map');

// get the locations from the map data
const tourLocations = map ? JSON.parse(map.dataset.locations) : [];

if (tourLocations.length) {
    initMap(tourLocations);
}

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        login(email, password);
    })
}
