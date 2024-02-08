const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
	if(this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})
const menuBar = document.querySelector('#content nav .bx.bx-menu');
 const sidebar = document.getElementById('sidebar');
 
 menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
 });