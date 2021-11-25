import axios from 'axios';
import { showAlert } from './alerts';

export const updateUserData = (event) => {
    const name = document.getElementById('name')
    const email = document.getElementById('email')

    event.preventDefault()
    const data = {
        name: name.value,
        email: email.value,
    }

    const url = '/api/v1/users/updateMe'
    const method = "PATCH"

    axios({
        url,
        method,
        data
    })
        .then(({ data }) => {
            name.value = data.data.user.name
            email.value = data.data.user.email
            showAlert('success', "Successfully Updated!!!")
        })
        .catch(error => {
            showAlert('error', error.response.data.message)
        })
}


export const updatePassword = (event) => {
    const oldPassword = document.getElementById('password-current')
    const newPassword = document.getElementById('password')
    const confirmPassword = document.getElementById('password-confirm')

    const button = document.querySelector('.btn-save-password')

    // disable the button and set it to loading
    button.disabled = true
    button.textContent = 'Loading...'

    event.preventDefault()

    const data = {
        currentPassword: oldPassword.value,
        password: newPassword.value,
        passwordConfirm: confirmPassword.value,
    }
    const url = '/api/v1/users/updatePassword'
    const method = "PATCH"

    axios({
        url,
        method,
        data
    })
        .then(({ data }) => {
            oldPassword.value = ''
            newPassword.value = ''
            confirmPassword.value = ''
            button.disabled = false
            button.textContent = 'Updated!'
            showAlert('success', "Successfully Updated Password!!!")
            setTimeout(() => {
                window.location.reload()
            }, 2000);
        })
        .catch(error => {
            showAlert('error', error.response.data.message)
        })

}