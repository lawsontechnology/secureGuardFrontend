          
const monthFilterDropdown = document.getElementById('monthFilter');
const yearFilterDropdown = document.getElementById('yearFilter');
const hourFilterDropdown = document.getElementById('hourFilter');
const minuteFilterDropdown = document.getElementById('minuteFilter');

for (let i = 1; i <= 12; i++) {
    const monthOption = document.createElement('option');
    monthOption.value = i.toString().padStart(2, '0');
    monthOption.textContent = new Date(2022, i - 1, 1).toLocaleString('en', { month: 'long' });
    monthFilterDropdown.appendChild(monthOption);
}

for (let i = 2020; i <= 2030; i++) {
    const yearOption = document.createElement('option');
    yearOption.value = i.toString();
    yearOption.textContent = i.toString();
    yearFilterDropdown.appendChild(yearOption);
}

for (let i = 0; i < 24; i++) {
    const hourOption = document.createElement('option');
    hourOption.value = i.toString().padStart(2, '0');
    hourOption.textContent = i.toString().padStart(2, '0');
    hourFilterDropdown.appendChild(hourOption);
}

// for (let i = 0; i < 60; i++) {
//     const minuteOption = document.createElement('option');
//     minuteOption.value = i.toString().padStart(2, '0');
//     minuteOption.textContent = i.toString().padStart(2, '0');
//     minuteFilterDropdown.appendChild(minuteOption);
// }

$(document).ready(function () {
    $('.datepicker-here').datepicker({
        dateFormat: 'yyyy-mm-dd'
    });
});
