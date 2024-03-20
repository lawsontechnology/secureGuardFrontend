const token = localStorage.getItem('jwtToken');

const getUserRoleFromToken = (token) => {
    try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        return decoded?.role;
    } catch (error) {
        console.error('Error decoding JWT token:', error);
        return null;
    }
};


const checkUserRole = (token, requiredRole) => {
    const userRole = getUserRoleFromToken(token);
    return userRole && userRole.includes(requiredRole);
};

const redirectToLogin = () => {
    window.location.href = 'login.html';
};


const requiredRole = 'Admin'; 
const hasRequiredRole = checkUserRole(token, requiredRole);

if (!hasRequiredRole) 
{
    
    redirectToLogin();
} 
else
 {
    
    const addAuthorizationHeader = (headers) => {
        if (token) {
            headers.setRequestHeader('Authorization', `Bearer ${token}`);
        }
    };

    $(document).ready(function () {
        $.ajaxSetup({
            beforeSend: addAuthorizationHeader,
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 401) {
                    console.error('Unauthorized access. Redirecting to login page...');
                    window.location.href = 'login.html';
                } else {
                    console.error('Ajax request error:', errorThrown);
                }
            }
        });
    
        
    
        $.get(`https://localhost:7075/api/User/All/Users`, function (data) {
            updateTable('userTable', data);
        });
        
        $.get(`https://localhost:7075/api/User/All/Securities`, function (data) {
            updateCardNumber('Security Personnel', data.length);
        });
    
        $.get(`https://localhost:7075/api/User/All/Hosts`, function (data) {
            updateCardNumber('Total Host', data.length);
        });
        
        $.get(`https://localhost:7075/api/Visitor/All`, function (data) {
            updateCardNumber('Total Visitor', data.length);
        });
        
        $.get(`https://localhost:7075/api/Role/All`, function (data) {
            console.log(data);
            updateCardNumber('Total Roles', data.length);
        });
    });
    

    function updateTable(tableId, data) {
        console.log('Updating table with data:', data);

        var tableBody = $('#' + tableId + ' tbody');
        var existingRows = tableBody.find('tr');

        if (existingRows.length >= 10) {
            existingRows.slice(10).remove();
        }

        $.each(data, function (index, item) {
            var row = `
                <tr>
                    <td>${item.firstName || 'N/A'}</td>
                    <td>${item.lastName || 'N/A'}</td>
                    <td>${item.email || 'N/A'}</td>
                    <td>${item.phoneNumber || 'N/A'}</td>
                    <td>${item.roleName || 'N/A'}</td>
                    <td>${item.securityCode || 'N/A'}</td>
                </tr>`;

            tableBody.append(row);
        });
    }
     
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
    

    function updateCardNumber(cardName, count) {
        $('.cardName:contains("' + cardName + '")').siblings('.numbers').text(count);
    }
}
