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

    const addAuthorizationHeader = (headers) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            headers.append('Authorization', 'Bearer ' + token);
        }
    };
     
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
    async function createRole() {
        const roleName = document.getElementById('roleName').value;
        const description = document.getElementById('description').value;

        const formData = new FormData();
        formData.append('RoleName', roleName);
        formData.append('Description', description);

        try {
            const headers = new Headers();
            addAuthorizationHeader(headers);

            const response = await fetch('https://localhost:7075/api/Role/Create', {
                method: 'POST',
                body: formData,
                headers: headers,
            });

            if (response.ok) {
                Toastify({
                    text: 'Role created successfully!',
                    backgroundColor: 'green',
                }).showToast();
            } else {

                const errorData = await response.json();
                Toastify({
                    text: `Failed to create role. Please try again. ${errorData.message}`,
                    backgroundColor: 'red',
                }).showToast();
            }
        } catch (error) {
            console.error('Error creating role:', error);
            Toastify({
                text: 'An unexpected error occurred. Please try again.',
                backgroundColor: 'red',
            }).showToast();
        }
    }
}
