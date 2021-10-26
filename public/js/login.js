import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'post',
            url: 'http://localhost:5000/api/v1/users/login',
            data: {
                email,
                password
            }
        })

        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }

    } catch (error) {
        showAlert('error', error.response.data.message);
    }
}
