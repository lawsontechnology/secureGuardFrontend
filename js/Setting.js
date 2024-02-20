// const token = localStorage.getItem('jwtToken');

 document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('profileForm');
    const userId = getUserIdFromToken(localStorage.getItem('jwtToken'));

    if (!userId) {
        console.error('User ID not found in the token.');
        return;
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        if (validateForm()) {
            try {
                const headers = new Headers();
                addAuthorizationHeader(headers);

                const formData = new FormData(form);

                const response = await fetch(`http://secureguard-001-site1.anytempurl.com/api/User/Update/${userId}`, {
                    method: 'PUT',
                    body: formData,
                    headers: headers,
                });

                if (response.ok) {
                    // alert('Profile updated successfully!');
                    window.location.href = 'Profile.html';
                } else {
                    const data = await response.json();
                    alert('Profile update failed. Please try again.' + data.message);
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('An unexpected error occurred. Please try again.');
            }
        }
    });

    function validateForm() {
        const oldPassword = form.querySelector('[name="oldPassword"]').value.trim();
        const newPassword = form.querySelector('[name="newPassword"]').value.trim();
        const confirmPassword = form.querySelector('[name="confirmPassword"]').value.trim();
        const phoneNumber = form.querySelector('[name="phoneNumber"]').value.trim();
        const gender = form.querySelector('[name="gender"]:checked').value.trim();

        const number = form.querySelector('[name="number"]').value.trim();
        const street = form.querySelector('[name="street"]').value.trim();
        const city = form.querySelector('[name="city"]').value.trim();
        const state = form.querySelector('[name="state"]').value.trim();
        const postalCode = form.querySelector('[name="postalCode"]').value.trim();

        if (!/^\d+$/.test(phoneNumber)) {
            alert('Invalid phone number format!');
            return false;
        }

        if (newPassword && !password(newPassword)) {
            alert('Password must be a minimum of 6 characters, either digits or letters');
            return false;
        }

        if (!oldPassword) {
            alert('Password is required!');
            return false;
        }

        return true;
    }

    function password(newPassword) {
        const passwordRegex = /^[A-Za-z0-9]{6,}$/;
        return passwordRegex.test(newPassword);
    }

    function addAuthorizationHeader(headers) {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            headers.append('Authorization', 'Bearer ' + token);
        }
    }

    function getUserIdFromToken(token) {
        try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            return decoded?.nameid;
        } catch (error) {
            console.error('Error decoding JWT token:', error);
            return null;
        }
    }
});

const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
	if(this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})

const menuBar = document.querySelector('#content nav .bx.bx-menu');
 const sidebar = document.getElementById('sidebar');
 
 menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
 });

