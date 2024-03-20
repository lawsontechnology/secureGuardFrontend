const token = localStorage.getItem('jwtToken');

const getUserRoleFromToken = (token) => {
    try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        return decoded?.role;
    } catch (error) {
        console.error('Error decoding JWT token:', error);
        return null;
    }
};

const checkUserRole = (token, requiredRole) => {
    const userRole = getUserRoleFromToken(token);
    return userRole && userRole.includes(requiredRole);
};

const redirectToLogin = () => {
    window.location.href = 'login.html';
};

const requiredRole = 'Admin';
const hasRequiredRole = checkUserRole(token, requiredRole);

if (!hasRequiredRole) {
    redirectToLogin();
} else {
     
    document.addEventListener('DOMContentLoaded', function () {
    
        const signOutBtn = document.getElementById('signOutBtn');
    
        if (signOutBtn) {
            signOutBtn.addEventListener('click', function (event) {
                event.preventDefault(); 
                localStorage.removeItem('jwtToken');
                window.location.href = 'login.html';
            });
        }
    });
    const addAuthorizationHeader = (headers) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            headers.append('Authorization', 'Bearer ' + token);
        }
    };
    var signButton = document.getElementById('signbutton');
    signButton.addEventListener('click', function (event) {
        event.preventDefault();

        signButton.textContent = 'Processing...'; 

        const formData = new FormData();
        formData.append('firstName', document.getElementById('firstName').value);
        formData.append('lastName', document.getElementById('lastName').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('securityCode', document.getElementById('SecurityCode').value);
        formData.append('password', document.getElementById('password').value);

        console.log(JSON.stringify(formData));
        const headers = new Headers();
        addAuthorizationHeader(headers);

        fetch('https://localhost:7075/api/User/Register/User', {
            method: 'POST',
            headers: headers,
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(' response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                Toastify({
                    text: 'User Is Successfully Created'+ data.message,
                    backgroundColor: 'green',
                }).showToast();
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                Toastify({
                    text: 'There was a problem with the fetch operation:'+ error.message,
                    backgroundColor: 'red',
                }).showToast();
            })
            .finally(() => {
                signButton.textContent = 'Sign up';
            });

    });

}