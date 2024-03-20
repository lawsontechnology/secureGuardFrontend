const token = localStorage.getItem('jwtToken');
const pageSize = 20;
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

if (!hasRequiredRole) {
     redirectToLogin();
} else {
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

               const response = await fetch(`https://localhost:7075/api/AuditLog/All?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
                    method: 'GET',
                    headers: headers,
               });

               const data = await response.json();
               return JSON.stringify(data, null, 4);
          } catch (error) {
               console.error('Error fetching data from backend:' + error);
               return null;
          }
     }

     const toBackendCSV = async function (pageNumber) {
          try {
               const headers = new Headers();
               addAuthorizationHeader(headers);

               const response = await fetch(`https://localhost:7075/api/AuditLog/All?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
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

     const toBackendExcel = async function (pageNumber) {
          try {
               const headers = new Headers();
               addAuthorizationHeader(headers);

               const response = await fetch(`https://localhost:7075/api/AuditLog/All?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
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
          const tableBody = document.querySelector('#customers_table tbody');
          const searchButton = document.getElementById('searchButton');
          const nextButton = document.getElementById('next');
          const previousButton = document.getElementById('previous');
          
          let currentPage = 1;
          let totalCount = 0;

          const updateTableData = async (pageNumber) => {
               try {
                    const headers = new Headers();
                    addAuthorizationHeader(headers);
                    const response = await fetch(`https://localhost:7075/api/AuditLog/All?PageNumber=${pageNumber}&PageSize=${pageSize}`, {
                         method: 'GET',
                         headers: headers,
                    });

                    const responseData = await response.json();

                    if (!Array.isArray(responseData.data)) {
                         console.error('Invalid data format received from backend:', responseData);
                         Toastify({
                              text: 'An unexpected error occurred. Please try again.',
                              backgroundColor: 'red',
                         }).showToast();
                         return;
                    }

                    const data = responseData.data;
                    
                    totalCount = responseData.totalCount;

                    const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                    tableBody.innerHTML = '';

                    const dateFormatter = new Intl.DateTimeFormat('en-US', {
                         year: 'numeric',
                         month: 'long',
                         day: 'numeric',
                         hour: 'numeric',
                         minute: 'numeric',
                         second: 'numeric'
                    });

                    sortedData.slice(0, pageSize).forEach((log, index) => {
                         const serialNumber = (pageNumber - 1) * pageSize + index + 1;
                         const row = document.createElement('tr');

                         const formattedDate = dateFormatter.format(new Date(log.timestamp));

                         row.innerHTML = `
                              <td>${serialNumber || ''}</td>
                              <td>${log.userEmail || ''}</td>
                              <td>${log.userRole || ''}</td>
                              <td>${log.action || ''}</td>
                              <td>${formattedDate || ''}</td>
                         `;
                         tableBody.appendChild(row);
                    });
                    const lastSerialNumber = (pageNumber - 1) * pageSize + data.length;
                    if (lastSerialNumber % 10 > totalCount % 10) {
                        nextButton.disabled = true;
                        nextButton.style.display = 'none'; 
                    } else {
                        nextButton.disabled = false;
                        nextButton.style.display = 'inline'; 
                    }

                   
                    if (lastSerialNumber % 10 === 20) {
                        previousButton.disabled = true;
                        previousButton.style.display = 'none'; 
                    } else {
                        previousButton.disabled = false;
                        previousButton.style.display = 'inline'; 
                    }
               } catch (error) {
                     console.log('Error fetching data from backend:', error);
                    // Toastify({
                    //      text: 'An unexpected error occurred. Please try again.' + error,
                    //      backgroundColor: 'red',
                    // }).showToast();
               }
          };

          updateTableData(currentPage);

          nextButton.addEventListener('click', () => {
              currentPage++;
              updateTableData(currentPage);
          });

          previousButton.addEventListener('click', () => {
              if (currentPage > 1) {
                  currentPage--;
                  updateTableData(currentPage);
              }
          });

          let scrollToTopIcon = document.getElementById('scrollToTop');

          window.onscroll = function () {
               scrollFunction();
          };

          function scrollFunction() {
               if (document.body.scrollTop > 3 || document.documentElement.scrollTop > 3) {
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
}
