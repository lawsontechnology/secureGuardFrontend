
    const addAuthorizationHeader = (headers) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            headers.append('Authorization', 'Bearer ' + token);
        }
    };

    document.getElementById('signbutton').addEventListener('click', function (event) {
        event.preventDefault(); 

        const formData = new FormData();
        formData.append('firstName', document.getElementById('firstName').value);
        formData.append('lastName', document.getElementById('lastName').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('securityCode', document.getElementById('SecurityCode').value);
        formData.append('password', document.getElementById('password').value);

        console.log( JSON.stringify(formData));
        const headers = new Headers();
        addAuthorizationHeader(headers);

           fetch('https://localhost:7075/api/User/Register/User', {
              method: 'POST',
              headers: headers,
              body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                alert('User Is Successfully Created', JSON.stringify(data));
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    });

