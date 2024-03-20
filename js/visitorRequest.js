const token = localStorage.getItem('jwtToken');
const pageSize = 10;

const addAuthorizationHeader = (headers) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        headers.append('Authorization', 'Bearer ' + token);
    }
};

const toBackendJSON = async function (pageNumber) {
    try {
        const headers = new Headers();
        addAuthorizationHeader(headers);

        const response = await fetch(`https://localhost:7075/api/Visitor/All?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
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

const toBackendCSV = async function (pageNumber) {
    try {
        const headers = new Headers();
        addAuthorizationHeader(headers);

        const response = await fetch(`https://localhost:7075/api/Visitor/All?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
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

const toBackendExcel = async function (pageNumber) {
    try {
        const headers = new Headers();
        addAuthorizationHeader(headers);

        const response = await fetch(`https://localhost:7075/api/Visitor/All?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
            method: 'GET',
            headers: headers,
        });

        const data = await response.json();

        const headings = Object.keys(data[0]).join('\t');
        const table_data = data.map(row => Object.values(row).join('\t')).join('\n');

        return headings + '\n' + table_data;
    } catch (error) {
        console.error('Error fetching data from backend:', error);
        return null;
    }
};

document.addEventListener('DOMContentLoaded', async function () {
    const search = document.querySelector('.input-group input');
    const tableBody = document.querySelector('tbody');
    const searchButton = document.getElementById('searchButton');

    const updateTableData = async (pageNumber) => {
        try {
            const headers = new Headers();
            addAuthorizationHeader(headers);

            const response = await fetch(`https://localhost:7075/api/Visitor/All?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
                method: 'GET',
                headers: headers,
            });

            const data = await response.json();

            const sortedData = data.sort((a, b) => new Date(b.VisitDate) - new Date(a.VisitDate));

            tableBody.innerHTML = '';
             
            const dateFormatter = new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
           });
            sortedData.slice(0, pageSize).forEach((visitor, index) => {
                const serialNumber = (pageNumber - 1) * pageSize + index + 1;
                const row = document.createElement('tr');
                
                const formattedDate = dateFormatter.format(new Date(visitor.visits[0].visitDate));

                row.innerHTML = `
                <td>${serialNumber || ''}</td>
                    <td><img src="https://localhost:7075/api/images/filename?filename=${visitor.image}" alt="${visitor.firstName} ${visitor.lastName}">${visitor.firstName} ${visitor.lastName}</td>
                    <td>${visitor.visits.length > 0 ? visitor.visits[0].visitReason || 'N/A' : 'N/A'}</td>
                    <td>${formattedDate || ''}</td>
                    <td>${visitor.visits.length > 0 ? visitor.visits[0].visitStatus || 'N/A' : 'N/A'}</td>
                    <td>${visitor.emailAddress || 'N/A'}</td>
                    <td>${visitor.phoneNumber || 'N/A'}</td>
                    `;
                    
                    tableBody.appendChild(row);
                    // <td>${visitor.visits.length > 0 ? visitor.visits[0].visitDate || 'N/A' : 'N/A'}</td>
            });

            const previousButton = document.getElementById('previous');
            const nextButton = document.getElementById('next');

            previousButton.disabled = pageNumber === 1;
            nextButton.disabled = data.length < pageSize;

            previousButton.addEventListener('click', () => {
                if (pageNumber > 1) {
                    updateTableData(pageNumber - 1);
                }
            });

            nextButton.addEventListener('click', () => {
                updateTableData(pageNumber + 1);
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
            };

            csv_btn.onclick = async () => {
                try {
                    const csv = await toBackendCSV(pageNumber);
                    if (csv !== null) {
                        downloadFile(csv, 'csv', 'visitor_list');
                    }
                } catch (error) {
                    console.error('Error exporting CSV:', error);
                }
            };

            excel_btn.onclick = async () => {
                try {
                    const excel = await toBackendExcel(pageNumber);
                    if (excel !== null) {
                        downloadFile(excel, 'excel');
                    }
                } catch (error) {
                    console.error('Error exporting Excel:', error);
                }
            };
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

    let currentPage = 1;
    updateTableData(currentPage);
    search.addEventListener('input', searchTable);
    searchButton.addEventListener('click', searchTable);
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
            updateTableData(currentPage);
        }
    });
});
