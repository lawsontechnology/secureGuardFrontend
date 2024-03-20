
  document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'https://localhost:7075/api/User';

   
    const addAuthorizationHeader = (headers) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            headers.append('Authorization', 'Bearer ' + token);
        }
    };
    
    const getUserIdFromToken = (token) => {
        try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            return decoded?.nameid
            
                } catch (error) {
            console.error('Error decoding JWT token:', error);
            return null;
        }
    };

    const updateProfile = (userData) => {

        const nameElement = document.getElementById('FullName');
        const telElement = document.getElementById('phoneNumber');
        const emailElement = document.getElementById('Email');
        const joinElement = document.getElementById('join');
        nameElement.textContent = `${userData.firstName} ${userData.lastName}`;
        telElement.textContent = userData.phoneNumber;
        emailElement.textContent = userData.email;
        joinElement.textContent = `Joined ${userData.dateCreated}`;
    };

    const fetchUserProfile = async () => {
        const headers = new Headers();
        addAuthorizationHeader(headers);

        const userId = getUserIdFromToken(localStorage.getItem('jwtToken'));

        if (!userId) {
            console.error('User ID not found in the token.');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}${userId}`, { 
                method: 'GET',
                headers: headers,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status) {
                updateProfile(data.data);
            } else {
                console.error('Error fetching user details:', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    fetchUserProfile();
  });

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

  const switchMode = document.getElementById('switch-mode');

  switchMode.addEventListener('change', function () {
      if (this.checked) {
          document.body.classList.add('dark');
      } else {
          document.body.classList.remove('dark');
      }
  })
  