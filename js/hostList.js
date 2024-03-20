const token = localStorage.getItem('jwtToken');
const pageSize = 10;
// const getUserRoleFromToken = (token) => {
//     try {
//         const decoded = JSON.parse(atob(token.split('.')[1]));
//         return decoded?.role;
//     } catch (error) {
//         console.error('Error decoding JWT token:', error);
//         return null;
//     }
// };

// const checkUserRole = (token, requiredRole) => {
//     const userRole = getUserRoleFromToken(token);
//     return userRole && userRole.includes(requiredRole);
// };

// const redirectToLogin = () => {
//     window.location.href = 'login.html';
// };

// const requiredRole = 'Admin';
// const hasRequiredRole = checkUserRole(token, requiredRole);

// if (!hasRequiredRole) {
//     redirectToLogin();
// } else {

const addAuthorizationHeader = (headers) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        headers.append('Authorization', 'Bearer ' + token);
    }
};

const toBackendJSON = async function (pageNumber = 1) {
    try {
        const headers = new Headers();
        addAuthorizationHeader(headers);

        const response = await fetch(`https://localhost:7075/api/User/All/Hosts?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
            method: 'GET',
            headers: headers,
        });

        const data = await response.json();
        return JSON.stringify(data, null, 4);
    } catch (error) {
        console.error('Error fetching data from backend:', error);
        return null;
    }
}

const toBackendCSV = async function (pageNumber = 1) {
    try {
        const headers = new Headers();
        addAuthorizationHeader(headers);

        const response = await fetch(`https://localhost:7075/api/User/All/Hosts?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
            method: 'GET',
            headers: headers,
        });

        const data = await response.json();

        const headings = Object.keys(data[0]).join(',');
        const table_data = data.map(row => Object.values(row).join(',')).join('\n');

        return headings + '\n' + table_data;
    } catch (error) {
        console.error('Error fetching data from backend:', error);
        return null;
    }
}

const toBackendExcel = async function (pageNumber = 1) {
    try {
        const headers = new Headers();
        addAuthorizationHeader(headers);

        const response = await fetch(`https://localhost:7075/api/User/All/Hosts?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
            method: 'GET',
            headers: headers,
        });

        const data = await response.json();

        const headings = Object.keys(data[0]).join('\t');
        const table_data = data.map(row => {
            const cells = Object.values(row);
            return cells.join('\t');
        }).join('\n');

        return headings + '\n' + table_data;
    } catch (error) {
        console.error('Error fetching data from backend:', error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    const search = document.querySelector('.input-group input');
    const tableBody = document.querySelector('#hostList tbody');
    const searchButton = document.getElementById('searchButton')

    const updateTableData = async (pageNumber = 1) => {
        try {
            const headers = new Headers();
            addAuthorizationHeader(headers);

            const response = await fetch(`https://localhost:7075/api/User/All/Hosts?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
                method: 'GET',
                headers: headers,
            });

            const data = await response.json();
            const sortedData = data.sort((a, b) => new Date(b.DateCreated) - new Date(a.DateCreated));

            tableBody.innerHTML = '';

            sortedData.slice(0, pageSize).forEach((host, index) => {
                const serialNumber = (pageNumber - 1) * pageSize + index + 1;
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${serialNumber || ''}</td>
                    <td>${host.firstName || 'N/A'}</td>
                    <td>${host.lastName || 'N/A'}</td>
                    <td>${host.email || 'N/A'}</td>
                    <td>${host.phoneNumber || 'N/A'}</td>
                    <td>
                    <button class="delete-btn" data-log-id="${host.id}" style="background-color: red;">Delete</button>
                </td>
               `;

                tableBody.appendChild(row);
            });

            const previousButton = document.getElementById('previous');
            const nextButton = document.getElementById('next');

            previousButton.disabled = pageNumber === 1;
            nextButton.disabled = data.length < pageSize;

            let currentPage = 1;

            previousButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updateTableData(currentPage);
                }
            });

            nextButton.addEventListener('click', () => {
                currentPage++;
                updateTableData(currentPage);
            });


            let scrollToTopIcon = document.getElementById('scrollToTop');

            window.onscroll = function () {
                scrollFunction();
            };

            function scrollFunction() {
                if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                    scrollToTopIcon.style.display = "block";
                } else {
                    scrollToTopIcon.style.display = "none";
                }
            }


            scrollToTopIcon.addEventListener('click', function () {
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            });

            const json_btn = document.getElementById('toJSON');
            const csv_btn = document.getElementById('toCSV');
            const excel_btn = document.getElementById('toEXCEL');

            json_btn.onclick = async () => {
                try {
                    const json = await toBackendJSON(pageNumber);
                    if (json !== null) {
                        downloadFile(json, 'json');
                    }
                } catch (error) {
                    console.error('Error exporting JSON:', error);
                }
            }

            csv_btn.onclick = async () => {
                try {
                    const csv = await toBackendCSV(pageNumber);
                    if (csv !== null) {
                        downloadFile(csv, 'csv', 'visitor_list');
                    }
                } catch (error) {
                    console.error('Error exporting CSV:', error);
                }
            }

            excel_btn.onclick = async () => {
                try {
                    const excel = await toBackendExcel(pageNumber);
                    if (excel !== null) {
                        downloadFile(excel, 'excel');
                    }
                } catch (error) {
                    console.error('Error exporting Excel:', error);
                }
            }

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', async () => {
                    const idToDelete = button.dataset.logId;

                    if (idToDelete) {
                        const userConfirmed = window.confirm('Are you sure you want to delete this log entry?');

                        if (userConfirmed) {
                            try {
                                const headers = new Headers();
                                addAuthorizationHeader(headers);

                                const response = await fetch(`https://localhost:7075/api/User/${idToDelete}`, {
                                    method: 'DELETE',
                                    headers: headers,
                                });

                                const result = await response.json();
                                console.log(result);

                                updateTableData();
                            } catch (error) {
                                console.error('Error deleting log:', error);
                            }
                        }
                    }
                });
            });
        } catch (error) {
            console.error('Error fetching data from backend:' + error);
            Toastify({
                text: 'An unexpected error occurred.' + error,
                backgroundColor: 'red',
            }).showToast();
        }
    };
      
    
    const searchTable = () => {
        const searchTerm = search.value.trim().toLowerCase();
        const rows = tableBody.getElementsByTagName('tr');

        for (const row of rows) {
            const cells = row.getElementsByTagName('td');
            let matchFound = false;

            for (const cell of cells) {
                const cellText = cell.textContent.toLowerCase();
                if (cellText.includes(searchTerm)) {
                    matchFound = true;
                    break;
                }
            }
            
            if (matchFound) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    };
    
    updateTableData();
    search.addEventListener('input', searchTable);
    searchButton.addEventListener('click', function () {
        searchTable();
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
    const exportFileCheckbox = document.getElementById('export-file');
    exportFileCheckbox.addEventListener('change', function () {
        if (this.checked) {
            updateTableData();
        }
    });
});
// }

