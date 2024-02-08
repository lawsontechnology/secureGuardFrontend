document.addEventListener('DOMContentLoaded', function () {
     const form = document.querySelector('form');
     form.addEventListener('submit', async function (event) {
         event.preventDefault(); 

         
         if (validateForm()) {
             
            try {
                const formData = new FormData(form);
                const response = await fetch('https://localhost:7075/api/Visitor/Register', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    alert('Registration successful!');
                } else {
                    alert('Registration failed:' + data.message);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('An unexpected error occurred. Please try again.');
            }
        }
    });

     
     function validateForm() {
         const firstName = form.querySelector('[name="firstName"]').value.trim();
         const lastName = form.querySelector('[name="lastName"]').value.trim();
         const hostEmail = form.querySelector('[name="hostEmail"]').value.trim();
         const email = form.querySelector('[name="email"]').value.trim();
         const phoneNumber = form.querySelector('[name="phoneNumber"]').value.trim();
         const gender = form.querySelector('[name="gender"]').value.trim();
         const image = form.querySelector('[name="image"]').files[0];
         const visitDate = form.querySelector('[name="visitDate"]').value.trim();
         const visitTime = form.querySelector('[name="visitTime"]').value.trim();
         const visitReason = form.querySelector('[name="visitReason"]').value.trim();

         
         if (!firstName || !lastName || !hostEmail || !email || !phoneNumber || !gender || !image || !visitDate || !visitTime || !visitReason) {
             alert('All fields are required!');
             return false;
         }

         if (!isValidEmail(email)) {
             alert('Invalid email format!');
             return false;
         }

         
         if (!/^\d+$/.test(phoneNumber)) {
             alert('Invalid phone number format!');
             return false;
         }

         return true;
     }

     
     function isValidEmail(email) {
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         return emailRegex.test(email);
     }
    
 });

 