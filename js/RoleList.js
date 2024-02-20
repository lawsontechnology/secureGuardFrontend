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

        const response = await fetch('http://secureguard-001-site1.anytempurl.com/api/Role/GetAll', {
            method: 'GET',
            headers: headers,
        });

        const data = await response.json();
        return JSON.stringify(data, null, 4);
    } catch (error) {
        console.error('Error fetching data from backend:', error);
        return null;
    }
};

const toBackendCSV = async function () {
    try {
        const headers = new Headers();
        addAuthorizationHeader(headers);

        const response = await fetch('http://secureguard-001-site1.anytempurl.com/api/Role/GetAll', {
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
};

const toBackendExcel = async function () {
    try {
        const headers = new Headers();
        addAuthorizationHeader(headers);

        const response = await fetch('http://secureguard-001-site1.anytempurl.com/api/Role/GetAll', {
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
};

document.addEventListener('DOMContentLoaded', async function () {
    const search = document.querySelector('.input-group input');
    const tableBody = document.querySelector('#hostList tbody');
    const searchButton = document.getElementById('searchButton')

    const updateTableData = async () => {
        try {
            const headers = new Headers();
            addAuthorizationHeader(headers);

            const response = await fetch('http://secureguard-001-site1.anytempurl.com/api/Role/GetAll', {
                method: 'GET',
                headers: headers,
            });

            const data = await response.json();
            console.log(data)
            const sortedData = data.sort((a, b) => new Date(b.DateCreated) - new Date(a.DateCreated));
          
            tableBody.innerHTML = '';

            sortedData.slice(0, 13).forEach((role, index) => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${role.name}</td>
                    <td>${role.description}</td>
                    <td>${role.dateCreated}</td>
                    <td>
                    <button class="delete-btn" data-log-id="${role.id}" style="background-color: red;">Delete</button>

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

                                    const response = await fetch(`http://secureguard-001-site1.anytempurl.com/api/AuditLog/Delete/${idToDelete}`, {
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
          const json_btn = document.getElementById('toJSON');
          const csv_btn = document.getElementById('toCSV');
          const excel_btn = document.getElementById('toEXCEL');

          json_btn.onclick = async () => {
               try {
                    const json = await toBackendJSON();
                    if (json !== null) {
                         downloadFile(json, 'json');
                    }
               } catch (error) {
                    console.error('Error exporting JSON:', error);
               }
          }

          csv_btn.onclick = async () => {
               try {
                    const csv = await toBackendCSV();
                    if (csv !== null) {
                         downloadFile(csv, 'csv', 'visitor_list');
                    }
               } catch (error) {
                    console.error('Error exporting CSV:', error);
               }
          }

          excel_btn.onclick = async () => {
               try {
                    const excel = await toBackendExcel();
                    if (excel !== null) {
                         downloadFile(excel, 'excel');
                    }
               } catch (error) {
                    console.error('Error exporting Excel:', error);
               }
          }
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


