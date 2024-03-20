// document.addEventListener("DOMContentLoaded", function() {

function performLogin() {
    var email = document.getElementById('loginemail').value;
    var password = document.getElementById('loginpassword').value;
    var errorMessageElement = document.getElementById('errorMessage');
    var loginButton = document.getElementById('loginButton');
    var credentials = {
        email: email,
        password: password,
    };
    const a = JSON.stringify(credentials);
    console.log(a);
    loginButton.textContent = 'Processing...'; 

    fetch('https://localhost:7075/api/User/Login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(response => {
            if (!response.ok) {
                console.error("Invalid email or Password");
                errorMessageElement.textContent = "Invalid email or password.";
                Toastify({
                    text: 'Invalid Email Or Password',
                    backgroundColor: 'Red',
                }).showToast();
                return Promise.reject("Invalid email or password.");
            }
            return response.json();
        })
        .then(data => {
            console.log('Login successful:', data);
            localStorage.setItem('jwtToken', data.token);
           
            var roles = Array.from(data.userRoles);
             console.log('Roles extracted from token:', roles);
             redirectBasedOnRole(roles, data.token);
            
        })
        .catch(error => {
            console.error('Login error:', error);
            errorMessageElement.textContent = "";
        })
        .finally(() => {
            loginButton.textContent = 'Login';
        });

}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


function redirectBasedOnRole(roles, token) {
    let isAuthorized = false;
    roles.forEach(role => {
        let roleName = role.name;

        if (roleName === 'Admin')
         {
            localStorage.setItem('jwtToken', token);
            window.location.href = "AdminDashBoard.html";
             isAuthorized = true;
        }
         else if (roleName === 'Host')
          {
            localStorage.setItem('jwtToken', token);
            location.href = "HostDashBoard.html";
            isAuthorized = true;
        }
         else if (roleName === 'Security') 
         { 
            localStorage.setItem('jwtToken', token);
            location.href = "SecurityDashBoard.html";
            isAuthorized = true;
        }
    });
    if (!isAuthorized) {
        Toastify({
            text: 'User Not Yet Authenticated',
            backgroundColor: 'red',
        }).showToast();
    }
}

// });        
    




