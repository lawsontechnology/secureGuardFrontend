const token = localStorage.getItem('jwtToken');

const addAuthorizationHeader = (headers) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        headers.append('Authorization', 'Bearer ' + token);
    }
};

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
            alert('Role created successfully!');
        } else {
            
            const errorData = await response.json();
            alert('Failed to create role. Please try again. ' + errorData.message);
        }
    } catch (error) {
        console.error('Error creating role:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}
