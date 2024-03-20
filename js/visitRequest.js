
document.addEventListener('DOMContentLoaded', function () {
    const visitRequestForm = document.querySelector('#visitRequestForm');
    const submitBtn = document.querySelector('#submitBtn');

    if (visitRequestForm && submitBtn) {
        submitBtn.addEventListener('click', async function (event) {
            event.preventDefault();
            
            if (validateVisitRequestForm()) {
                try {

                    submitBtn.disabled = true;
                    submitBtn.innerText = 'Please wait...';
                    
                    const formData = new FormData();

                    formData.append('FirstName', document.getElementById('firstName').value.trim());
                    formData.append('LastName', document.getElementById('lastName').value.trim());
                    formData.append('HostEmail', document.getElementById('hostEmail').value.trim());
                    formData.append('EmailAddress', document.getElementById('email').value.trim());
                    formData.append('PhoneNumber', document.getElementById('phoneNumber').value.trim());
                    formData.append('Gender', document.querySelector('input[name="Gender"]:checked').value);
                    formData.append('Image', document.getElementById('image').files[0]);
                    formData.append('VisitDateAndTime', document.getElementById('visitDate').value.trim());
                    formData.append('VisitReason', document.getElementById('visitReason').value);
                    console.log(JSON.stringify(formData));
                    const response = await fetch('https://localhost:7075/api/Visitor/Register', {
                        method: 'POST',
                        body: formData,
                    });
                     
                    submitBtn.disabled = false;
                    submitBtn.innerText = 'Send Request';

                    if (response.ok) {
                        Toastify({
                            text: 'Visit request successful!',
                            backgroundColor: 'Green',
                        }).showToast();
                    } else {
                        console.error('Visit request failed:', response.status, response.statusText);
                        console.log(await response.text());
                        Toastify({
                            text:'Visit request failed: ' + response.statusText,
                            backgroundColor: 'red',
                        }).showToast();
                    }
                } catch (error) {
                    console.error('Error submitting visit request form:', error);
                    Toastify({
                        text: 'An unexpected error occurred. Please try again.',
                        backgroundColor: 'red',
                    }).showToast();
                }
            }
        });
    }

    function validateVisitRequestForm() {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const hostEmail = document.getElementById('hostEmail').value.trim();
        const email = document.getElementById('email').value.trim();
        const phoneNumber = document.getElementById('phoneNumber').value.trim();
        const gender = document.querySelector('input[name="Gender"]:checked');
        const image = document.getElementById('image').files[0];
        const visitDate = document.getElementById('visitDate').value.trim();
        const visitReason = document.getElementById('visitReason').value;
    
        if (!firstName || !lastName || !hostEmail || !email || !phoneNumber || !gender || !image || !visitDate || !visitReason) {
            
            Toastify({
                text: 'All fields are required!',
                backgroundColor: 'red',
            }).showToast();
            return false;
        }
    
        if (!isValidEmail(email)) {
            Toastify({
                text: 'Invalid email format!',
                backgroundColor: 'red',
            }).showToast();
            return false;
        }
    
        if (!/^\d+$/.test(phoneNumber)) {
            Toastify({
                text: 'Invalid phone number format!',
                backgroundColor: 'red',
            }).showToast();
            return false;
        }
        return true;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

});
