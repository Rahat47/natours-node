import '@babel/polyfill';
import { login, logout } from "./login";
import initMap from './mapbox';
import { updatePassword, updateUserData } from './updateSettings';
// Get the form for login page
const form = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userForm = document.querySelector('.form-user-data');
const userSettingsForm = document.querySelector('.form-user-settings');

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

if (userForm) {
    userForm.addEventListener('submit', updateUserData)
}

if (userSettingsForm) {
    userSettingsForm.addEventListener('submit', updatePassword)
}


if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}
