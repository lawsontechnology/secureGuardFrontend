const token = localStorage.getItem('jwtToken');

const addAuthorizationHeader = (headers) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        headers.append('Authorization', 'Bearer ' + token);
    }
};
document.addEventListener('DOMContentLoaded', function () {
     const form = document.getElementById('profileForm');
     const userId = getUserIdFromUrl(); 
 
     form.addEventListener('submit', async function (event) {
         event.preventDefault();
 
         if (validateForm()) {
             try {
                const headers = new Headers();
                addAuthorizationHeader(headers);

                 const formData = new FormData(form);
                 const response = await fetch(`https://localhost:7075/api/User/${userId}`, {
                     method: 'PUT',
                     body: formData,
                     headers: headers,
                 });
 
                 if (response.ok) {
                    Toastify({
                        text: 'Profile updated successfully!',
                        backgroundColor: 'Green',
                    }).showToast();
                } else {
                    const errorMessage = data ? data.message : 'Profile update failed. Please try again.';
                    Toastify({
                        text: errorMessage,
                        backgroundColor: 'red',
                    }).showToast();
                }                
             } catch (error) {
                 console.error('Error updating profile:', error);
                 Toastify({
                    text: 'An unexpected error occurred. Please try again.',
                    backgroundColor: 'red',
                }).showToast();
             }
         }
     });
 
     function getUserIdFromUrl() {
         const urlParts = window.location.pathname.split('/');
         return urlParts[urlParts.length - 1];
     }
     function validateForm() {
         const oldPassword = form.querySelector('[name="OldPassword"]').value.trim();
         const NewPassword = form.querySelector('[name="NewPassword"]').value.trim();
         const ConfirmPassword = form.querySelector('[name="ConfirmPassword"]').value.trim();
         const Gender = form.querySelector('[name="Gender"]').value.trim();
         const phoneNumber = form.querySelector('[name="phoneNumber"]').value.trim();
         const securityCode = form.querySelector('[name="securityCode"]').value.trim();
         const Number = form.querySelector('[name="Number"]').value.trim();
         const Street = form.querySelector('[name="Street"]').value.trim();
         const City = form.querySelector('[name="City"]').value.trim();
         const State = form.querySelector('[name="State"]').value.trim();
         const PostalCode = form.querySelector('[name="PostalCode"]').value.trim();

          if (!/^\d+$/.test(phoneNumber)) {
            Toastify({
                text: 'Invalid phone number format!',
                backgroundColor: 'red',
            }).showToast();
               return false;
           }
          if(!NewPassword)
          {
               if (!password(NewPassword)) {
                Toastify({
                    text: 'Password Must be a minimum of 6 characters, either digits or letters',
                    backgroundColor: 'red',
                }).showToast();
                   return false;
               }
          }
          if(!oldPassword)
          {
            Toastify({
                text: 'Password Is required!',
                backgroundColor: 'red',
            }).showToast();
             return false;
         }
         return true; 
     }

     function password(NewPassword)
     {
        const passwordRegex =/^[A-Za-z0-9]{6,}$/;
        return passwordRegex.test(NewPassword);
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

const menuBar = document.querySelector('#content nav .bx.bx-menu');
 const sidebar = document.getElementById('sidebar');
 
 menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
 });