const token = localStorage.getItem('jwtToken');

const addAuthorizationHeader = (headers) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        headers.append('Authorization', 'Bearer ' + token);
    }
};

const toBackendJSON = async function () {
    try {
        const headers = new Headers();
        addAuthorizationHeader(headers);

        const response = await fetch('https://localhost:7075/api/User/GetAll/Hosts', {
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

const toBackendCSV = async function () {
    try {
        const headers = new Headers();
        addAuthorizationHeader(headers);

        const response = await fetch('https://localhost:7075/api/User/GetAll/Hosts', {
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

const toBackendExcel = async function () {
    try {
        const headers = new Headers();
        addAuthorizationHeader(headers);

        const response = await fetch('https://localhost:7075/api/User/GetAll/Hosts', {
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

    const updateTableData = async () => {
        try {
            const headers = new Headers();
            addAuthorizationHeader(headers);

            const response = await fetch('https://localhost:7075/api/User/GetAll/Hosts', {
                method: 'GET',
                headers: headers,
            });

            const data = await response.json();
            const sortedData = data.sort((a, b) => new Date(b.DateCreated) - new Date(a.DateCreated));

            tableBody.innerHTML = '';

            sortedData.slice(0, 13).forEach((host, index) => {
                const row = document.createElement('tr');
  
                row.innerHTML = `
                    <td>${index + 1}</td>
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

           document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', async () => {
                     const idToDelete = button.dataset.logId;

                     if (idToDelete) {
                          const userConfirmed = window.confirm('Are you sure you want to delete this log entry?');

                          if (userConfirmed) {
                               try {
                                    const headers = new Headers();
                                    addAuthorizationHeader(headers);

                                    const response = await fetch(`https://localhost:7075/api/AuditLog/Delete/${idToDelete}`, {
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
            console.error('Error fetching data from backend:', error);
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
                    cell.classList.add('highlighted');
                } else {
                    cell.classList.remove('highlighted');
                }
            }

            if (matchFound) {
                row.classList.add('highlighted');
            } else {
                row.classList.remove('highlighted');
            }
        }
    };

    updateTableData();
    search.addEventListener('input', searchTable);
    searchButton.addEventListener('click', function () {
        searchTable();
    });
    const exportFileCheckbox = document.getElementById('export-file');
    exportFileCheckbox.addEventListener('change', function () {
        if (this.checked) {
            updateTableData();
        }
    });
});


