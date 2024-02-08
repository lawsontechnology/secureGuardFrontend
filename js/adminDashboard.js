const token = localStorage.getItem('jwtToken');

const addAuthorizationHeader = (headers) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        headers.append('Authorization', `Bearer ${token}`);
    }
};

$(document).ready(function () {
    const token = localStorage.getItem('jwtToken');

    function addAuthorizationHeader(xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    $.ajaxSetup({
        beforeSend: addAuthorizationHeader,
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 401) {
                console.error('Unauthorized access. Redirecting to login page...');
                window.location.href = '/login';
            } else {
                console.error('Ajax request error:', errorThrown);
            }
        }
    });

    $.get('https://localhost:7075/api/User/GetAll/Users', function (data) {
        console.log(data);
        updateTable('userTable', data);
    });

    $.get('https://localhost:7075/api/User/GetAll/Securities', function (data) {
        updateCardNumber('Security Personnel', data.length);
    });

    $.get('https://localhost:7075/api/User/GetAll/Hosts', function (data) {
        updateCardNumber('Total Host', data.length);
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

function updateCardNumber(cardName, count) {
    $('.cardName:contains("' + cardName + '")').siblings('.numbers').text(count);
}

