
  document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://secureguard-001-site1.anytempurl.com/api/User';

   
    const addAuthorizationHeader = (headers) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            headers.append('Authorization', 'Bearer ' + token);
        }
    };

    
    const getUserIdFromToken = (token) => {
        try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            // console.log(decoded)
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
        // const securityCodeElement = document.getElementById('SecurityCode');
        // const numberElement = document.getElementById('Number');
        // const streetElement = document.getElementById('Street');
        // const cityElement = document.getElementById('City');
        // const stateElement = document.getElementById('State');
        const joinElement = document.getElementById('join');
            // console.log(userData);
        nameElement.textContent = `${userData.firstName} ${userData.lastName}`;
        telElement.textContent = userData.phoneNumber;
        emailElement.textContent = userData.email;
        // numberElement.textContent = userData.number;
        // securityCodeElement.textContent = userData.securityCode;
        // streetElement.textContent = userData.street;
        // cityElement.textContent = userData.city;
        // stateElement.textContent = userData.state;
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
            const response = await fetch(`${apiUrl}/Id/${userId}`, { 
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

  const switchMode = document.getElementById('switch-mode');

  switchMode.addEventListener('change', function () {
      if (this.checked) {
          document.body.classList.add('dark');
      } else {
          document.body.classList.remove('dark');
      }
  })
  