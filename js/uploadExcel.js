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

if (!hasRequiredRole) 
{
    
    redirectToLogin();
} 
else
 {
    document.addEventListener('DOMContentLoaded', function () {
        const uploadButton = document.getElementById('UpLoad');
        const fileInput = document.getElementById('ExcelFile');
        const roleIdSelect = document.getElementById('RoleId');
        const downloadButton = document.querySelector('.downloadSheet');

        uploadButton.addEventListener('click', async () => {
            try {
                event.preventDefault();
                uploadButton.querySelector('.button__text').textContent = 'Processing...';
        
                if (!fileInput.files[0]) {
                    Toastify({
                        text: 'Please select a file to upload.',
                        backgroundColor: 'red',
                    }).showToast();
                    return;
                }
        
                const formData = new FormData();
                formData.append('File', fileInput.files[0]);
                formData.append('RoleId', roleIdSelect.value.trim());
        
                console.log([...formData.entries()]);
        
                const response = await fetch(`https://localhost:7075/api/Excel/Upload`, {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                // alert(JSON.stringify(data));
                if (!data.status) {
                    Toastify({
                        text: 'Error: ' + data.message,
                        backgroundColor: 'red',
                    }).showToast();
                    return;
                }
                else {
                    Toastify({
                        text: 'File uploaded successfully!' + data.message,
                        backgroundColor: 'green',
                    }).showToast();
                }
            } catch (error) {
                console.error('Error:', error);
                Toastify({
                    text: 'An unexpected error occurred. Please try again.' + error.message,
                    backgroundColor: 'red',
                }).showToast();
            } finally {
                uploadButton.querySelector('.button__text').textContent = 'Upload File';
            }
        });
        

        downloadButton.addEventListener('click', async () => {
            try {
                
                window.location.href = 'https://localhost:7075/api/Excel/Template';
            } catch (error) {
                console.error('Error:', error);
                Toastify({
                    text: 'An error occurred while downloading the file.' + error.message,
                    backgroundColor: 'red',
                    

                }).showToast();
            }

        });
    });
}
