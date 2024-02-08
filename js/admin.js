document.addEventListener("DOMContentLoaded", function () {

let list = document.querySelectorAll(".navigation li");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));

let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};

let signOutLink = document.querySelector(".navigation li:last-child a");
    signOutLink.addEventListener("click", function (event) {
        event.preventDefault();
        localStorage.removeItem('jwtToken');
        window.location.href = "index.html";
    });

  });