const token = localStorage.getItem('jwtToken');

const addAuthorizationHeader = (headers) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        headers.append('Authorization', 'Bearer ' + token);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const downloadButton = document.querySelector('.downloadSheet');
    const uploadButton = document.querySelector('.login__submit');
    const fileInput = document.querySelector('.login__input');
    const roleIdSelect = document.getElementById('ExcelFile');

    downloadButton.addEventListener('click', async () => {
        try {
            const headers = new Headers();
            addAuthorizationHeader(headers);
            window.location.href = 'http://secureguard-001-site1.anytempurl.com/api/Excel/Export/ExcelTemplate';
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while downloading the file.');
        }
    });

    uploadButton.addEventListener('click', async () => {
        try {
            if (fileInput.files.length === 0) {
                alert('Please select a file to upload.');
                return;
            }

            const headers = new Headers();
            addAuthorizationHeader(headers);

            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            formData.append('roleId', roleIdSelect.value);

            const response = await fetch('http://secureguard-001-site1.anytempurl.com/api/Excel/ImportAndSave', {
                method: 'POST',
                body: formData,
                headers: headers,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.status) {
                alert('File uploaded successfully!');
            } else {
                alert('Error uploading file: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while uploading the file.');
        }
    });
});
