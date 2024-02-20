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
                 const response = await fetch(`http://secureguard-001-site1.anytempurl.com/api/User/Update/${userId}`, {
                     method: 'PUT',
                     body: formData,
                     headers: headers,
                 });
 
                 if (response.ok) {
                    alert('Profile updated successfully!');
                } else {
                    const errorMessage = data ? data.message : 'Profile update failed. Please try again.';
                    alert(errorMessage);
                }                
             } catch (error) {
                 console.error('Error updating profile:', error);
                 alert('An unexpected error occurred. Please try again.');
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
               alert('Invalid phone number format!');
               return false;
           }
          if(!NewPassword)
          {
               if (!password(NewPassword)) {
                   alert('Password Must be a minimum of 6 characters, either digits or letters');
                   return false;
               }
          }
          if(!oldPassword)
          {
              alert('Password Is required!');
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

const menuBar = document.querySelector('#content nav .bx.bx-menu');
 const sidebar = document.getElementById('sidebar');
 
 menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
 });