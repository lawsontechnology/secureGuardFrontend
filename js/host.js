
const getUserRoleFromToken = (token) => {
	try {
		const decoded = JSON.parse(atob(token.split('.')[1]));
		return decoded?.role;
	} catch (error) {
		console.error('Error decoding JWT token:', error);
		return null;
	}
};
const paging = {
	PageNumber: 1,
	PageSize: 20
};
const checkUserRole = (token, requiredRole) => {
	const userRole = getUserRoleFromToken(token);
	return userRole && userRole.includes(requiredRole);
};

const redirectToLogin = () => {
	window.location.href = 'login.html';
};

const token = localStorage.getItem('jwtToken');

if (!token) {
	redirectToLogin();
} else {
	const requiredRole = 'Host';
	const hasRequiredRole = checkUserRole(token, requiredRole);

	if (!hasRequiredRole) {
		redirectToLogin();
	} else {
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
		const addAuthorizationHeader = (headers) => {
			const token = localStorage.getItem('jwtToken');
			if (token) {
				headers.append('Authorization', 'Bearer ' + token);
			}
		};
		document.addEventListener('DOMContentLoaded', function () {
			const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
			const searchButton = document.querySelector('#content nav form .form-input button');
			const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
			const searchForm = document.querySelector('#content nav form');
			const sidebar = document.getElementById('sidebar');

			allSideMenu.forEach(item => {
				const li = item.parentElement;

				item.addEventListener('click', function () {
					allSideMenu.forEach(i => {
						i.parentElement.classList.remove('active');
					});
					li.classList.add('active');
				});
			});

			const todoList = document.querySelector('.todo-list');
			const addTodoButton = document.querySelector('.bx-plus');

			function createTodoItem(text) {
				const li = document.createElement('li');
				li.innerHTML = `
			    <p>${text}</p>
			    <i class='bx bx-dots-vertical-rounded'></i>
			    <div class="todo-options">
				 <span class="edit-todo">Edit</span>
				 <span class="delete-todo">Delete</span>
			    </div>
			  `;
				return li;
			}

			function addNewTodo() {
				const newTodoText = prompt('Enter your new todo:');
				if (newTodoText !== null) {
					const newTodoItem = createTodoItem(newTodoText);
					todoList.appendChild(newTodoItem);
				}
			}

			const sampleTodoText = "Todo List";
			const sampleTodoItem = createTodoItem(sampleTodoText);
			todoList.appendChild(sampleTodoItem);

			todoList.addEventListener('click', function (e) {
				const target = e.target;
				if (target.classList.contains('bx-dots-vertical-rounded')) {
					showTodoOptions(target);
				} else if (target.classList.contains('edit-todo')) {
					editTodoItem(target);
				} else if (target.classList.contains('delete-todo')) {
					confirmDeleteTodoItem(target);
				}
			});

			addTodoButton.addEventListener('click', function () {
				addNewTodo();
			});

			function showTodoOptions(icon) {
				const todoOptions = icon.parentElement.querySelector('.todo-options');
				if (todoOptions) {
					todoOptions.classList.toggle('show');
				}
			}

			function editTodoItem(span) {
				const todoText = span.parentElement.parentElement.querySelector('p').innerText;
				const updatedText = prompt('Edit your todo:', todoText);
				if (updatedText !== null) {
					span.parentElement.parentElement.querySelector('p').innerText = updatedText;
				}
				span.parentElement.classList.remove('show');
			}

			function confirmDeleteTodoItem(span) {
				const confirmation = window.confirm('Are you sure you want to delete this todo?');
				if (confirmation) {
					const todoItem = span.parentElement.parentElement;
					todoItem.remove();
				}
				span.parentElement.classList.remove('show');
			}

			searchButton.addEventListener('click', function (e) {
				if (window.innerWidth < 576) {
					e.preventDefault();
					searchForm.classList.toggle('show');
					if (searchForm.classList.contains('show')) {
						searchButtonIcon.classList.replace('bx-search', 'bx-x');
					} else {
						searchButtonIcon.classList.replace('bx-x', 'bx-search');
					}
				}
			});

			if (window.innerWidth < 768) {
				sidebar.classList.add('hide');
			} else if (window.innerWidth > 576) {
				searchButtonIcon.classList.replace('bx-x', 'bx-search');
				searchForm.classList.remove('show');
			}

			window.addEventListener('resize', function () {
				if (this.innerWidth > 576) {
					searchButtonIcon.classList.replace('bx-x', 'bx-search');
					searchForm.classList.remove('show');
				}
			});

			const switchMode = document.getElementById('switch-mode');

			switchMode.addEventListener('change', function () {
				if (this.checked) {
					document.body.classList.add('dark');
				} else {
					document.body.classList.remove('dark');
				}
			});

			const getUserEmailFromToken = (token) => {
				try {
					const decoded = JSON.parse(atob(token.split('.')[1]));
					return decoded?.email;
				} catch (error) {
					console.error('Error decoding JWT token:', error);
					return null;
				}
			};

			// const headers = new Headers();
			// addAuthorizationHeader(headers);

			const updateVisitorCount = async () => {
				const token = localStorage.getItem('jwtToken');

				if (token) {
					const userEmail = getUserEmailFromToken(token);
					console.log('User Email:', userEmail);


					if (userEmail) {
						try {
							const headers = new Headers();
							addAuthorizationHeader(headers);
							const response = await fetch(`https://localhost:7075/api/Visitor/AllApproved/Visit?hostEmail=${userEmail}`, {
								method: 'GET',
								headers: headers,
							});
							const data = await response.json();
							console.log('Visitor Count Data:', data);

							document.getElementById('visitorCount').innerHTML = `<h3>${data.length}</h3><p>Visitors</p>`;
						} catch (error) {
							console.error('Error fetching visitor count:', error);
						}
					}
				}
			};

			const updateVisitRequestCount = async () => {
				const token = localStorage.getItem('jwtToken');

				if (token) {
					const userEmail = getUserEmailFromToken(token);

					if (userEmail) {
						try {
							const headers = new Headers();
							addAuthorizationHeader(headers);
							const response = await fetch(`https://localhost:7075/api/Visitor/HostEmail?hostEmail=${userEmail}`, {
								method: 'Get',
								headers: headers,
							});
							const data = await response.json();

							// console.log('Visit Request Count Data:', data);

							document.getElementById('visitRequestCount').innerHTML = `<h3>${data.length}</h3><p>Visit-Request</p>`;
						} catch (error) {
							console.error('Error fetching visit request count:', error);
						}
					}
				}
			};

			const updateTableData = async () => {
				const token = localStorage.getItem('jwtToken');

				const userEmail = getUserEmailFromToken(token);
				if (userEmail) {
					try {

						const headers = new Headers();
						addAuthorizationHeader(headers);
						const response = await fetch(`https://localhost:7075/api/Visitor/HostEmail?hostEmail=${userEmail}`, {
							method: 'GET',
							headers: headers,
						});

						const data = await response.json();

						const sortedData = data.sort((a, b) => new Date(b.visits[0]?.visitDate) - new Date(a.visits[0]?.visitDate));

						const tableBody = document.querySelector('.table-data tbody');
						tableBody.innerHTML = '';
                              const dateFormatter = new Intl.DateTimeFormat('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
							hour: 'numeric',
							minute: 'numeric',
							second: 'numeric'
						});
						sortedData.slice(0, 10).forEach((visitor) => {
							const imageSrc = `'https://localhost:7075/api/images/filename?filename=${visitor.image}'`;
							const formattedDate = dateFormatter.format(new Date(visitor.visits[0].visitDate));
							const row = `<tr>
							 <td>
								<div class="visitor-image" style="background-image: url('${imageSrc}');"></div>
								${visitor.firstName} ${visitor.lastName}
							 </td>
							 <td>${formattedDate || ''}</td>
							 <td>${visitor.visits.length > 0 ? visitor.visits[0].visitReason || 'N/A' : 'N/A'}</td>
							 <td>${visitor.visits.length > 0 ? visitor.visits[0].visitStatus || 'N/A' : 'N/A'}</td>
						  </tr>`;
							tableBody.innerHTML += row;
						});
					} catch (error) {
						console.error('Error fetching table data:', error);
					}
				}
			};


			updateVisitorCount();
			updateVisitRequestCount();
			updateTableData();
              
			const menuBar = document.querySelector('#content nav .bx.bx-menu');

			menuBar.addEventListener('click', function () {
				sidebar.classList.toggle('hide');
			});
		});
	}
}

