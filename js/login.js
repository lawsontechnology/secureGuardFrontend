// document.addEventListener("DOMContentLoaded", function() {

function performLogin() {
    var email = document.getElementById('loginemail').value;
    var password = document.getElementById('loginpassword').value;

    var credentials = {
        email: email,
        password: password,
    };
    const a = JSON.stringify(credentials);
    console.log(a);

    fetch('http://secureguard-001-site1.anytempurl.com/api/User/Login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(response => {
            if (!response.ok) {
                alert("Invalid email or Password");
                throw new Error('Invalid email or password');
            }
            return response.json();
        })
        .then(data => {
            console.log('Login successful:', data);
            localStorage.setItem('jwtToken', data.token);
            // var roles = parseJwt(data.token);
            var roles = Array.from(data.userRoles);
             console.log('Roles extracted from token:', roles);
             redirectBasedOnRole(roles, data.token);

             console.log('Login successful:', data);

             console.log('User roles from server:', data.userRoles);
             console.log('user token',data.token)
            
        })
        .catch(error => {
            console.error('Login error:', error);
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

        if (roleName === 'Admin') {
            // alert("Redirecting to Admin Dashboard");
            localStorage.setItem('jwtToken', token);
            window.location.href = "AdminDashBoard.html";
             isAuthorized = true;
        } else if (roleName === 'Host') {
            // alert("Redirecting to Host Dashboard");
            localStorage.setItem('jwtToken', token);
            location.href = "HostDashBoard.html";
            isAuthorized = true;
        } else if (roleName === 'Security') {
            // alert("Redirecting to Security Dashboard");
            localStorage.setItem('jwtToken', token);
            location.href = "SecurityDashBoard.html";
            isAuthorized = true;
        }
    });
    if (!isAuthorized) {
        alert("User Not Yet Authorized!");
    }
}

// });        
    




