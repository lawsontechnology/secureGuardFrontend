const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item=> {
	const li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i=> {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});

const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
	if(window.innerWidth < 576) {
		e.preventDefault();
		searchForm.classList.toggle('show');
		if(searchForm.classList.contains('show')) {
			searchButtonIcon.classList.replace('bx-search', 'bx-x');
		} else {
			searchButtonIcon.classList.replace('bx-x', 'bx-search');
		}
	}
})

if(window.innerWidth < 768) {
	sidebar.classList.add('hide');
} else if(window.innerWidth > 576) {
	searchButtonIcon.classList.replace('bx-x', 'bx-search');
	searchForm.classList.remove('show');
}


window.addEventListener('resize', function () {
	if(this.innerWidth > 576) {
		searchButtonIcon.classList.replace('bx-x', 'bx-search');
		searchForm.classList.remove('show');
	}
})

const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
	if(this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})



const getUserEmailFromToken = (token) => {
	try {
	    const decoded = JSON.parse(atob(token.split('.')[1]));
	    return decoded?.email;
	} catch (error) {
	    console.error('Error decoding JWT token:', error);
	    return null;
	}
 };
 
 
 const updateVisitorCount = async () => {
	const token = localStorage.getItem('jwtToken');
 
	if (token) {
	    const userEmail = getUserEmailFromToken(token);
 
	    if (userEmail) {
		   try {
			  const response = await fetch(`https://localhost7075/api/Visitor/AllApproved/Visit?hostEmail=${userEmail}`);
			  const data = await response.json();
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
			  const response = await fetch(`https://localhost7075/api/Visitor/HostEmail?hostEmail=${userEmail}`);
			  const data = await response.json();
			  document.getElementById('visitRequestCount').innerHTML = `<h3>${data.length}</h3><p>Visit-Request</p>`;
		   } catch (error) {
			  console.error('Error fetching visit request count:', error);
		   }
	    }
	}
 };
 

 const updateTableData = async () => {
	const token = localStorage.getItem('jwtToken');
 
	if (token) {
	    try {
		   const response = await fetch('http://secureguard-001-site1.anytempurl.com/api/Visitor/GetAll', {
			  method: 'GET',
			  headers: {
				 'Authorization': `Bearer ${token}`
			  }
		   });
		   const data = await response.json();
 
		   const sortedData = data.sort((a, b) => new Date(b.visits[0]?.visitDate) - new Date(a.visits[0]?.visitDate));
 
		   const tableBody = document.querySelector('.table-data tbody');
		   tableBody.innerHTML = '';
		   const baseUrl = 'http://secureguard-001-site1.anytempurl.com/api/images/';
 
		   sortedData.slice(0, 10).forEach((visitor) => {
			  const imageSrc = `${baseUrl}${visitor.image}`;
			  const row = `<tr>
				 <td>
					<div class="visitor-image" style="background-image: url('${imageSrc}');"></div>
					${visitor.firstName} ${visitor.lastName}
				 </td>
				 <td>${visitor.visits.length > 0 ? visitor.visits[0].visitDate || 'N/A' : 'N/A'}</td>
				 <td>${visitor.visits.length > 0 ? visitor.visits[0].visitTime || 'N/A' : 'N/A'}</td>
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
 
 // Toggle sidebar
 const menuBar = document.querySelector('#content nav .bx.bx-menu');
 const sidebar = document.getElementById('sidebar');
 
 menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
 });
 