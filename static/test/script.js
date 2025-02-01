document.addEventListener("DOMContentLoaded", function () {
  const usernameElement = document.getElementById("username");
  const username = usernameElement ? usernameElement.getAttribute("data-username") : "";

  const navbarMenu = document.querySelector(".navbar__menu");
  const today = new Date();
  const formattedDate = today.getDate().toString().padStart(2, '0') + '-' +
                        (today.getMonth() + 1).toString().padStart(2, '0') + '-' +
                        today.getFullYear();

  const listItem1 = document.createElement("li");
  listItem1.classList.add("navbar__item");
  const link1 = document.createElement("a");
  link1.classList.add("navbar__links");
  link1.textContent = formattedDate;
  listItem1.appendChild(link1);
  navbarMenu.appendChild(listItem1);
  if (navbarMenu && username) {
      const listItem = document.createElement("li");
      listItem.classList.add("navbar__item");

      const link = document.createElement("a");
      link.classList.add("navbar__links");
      link.textContent = username;
      listItem.appendChild(link);
      navbarMenu.appendChild(listItem);
  }
});

const urlParams = new URLSearchParams(window.location.search);
const testId = urlParams.get('testid')

fetch("tests_data/get_ids/")
  .then(response => response.json())
  .then(d => {
    let x = d.ids;
    if (x.includes(testId)) {
    } else {
      window.location.href = "/";
    }
  })
  .catch(error => {
    console.error("Error fetching JSON:", error);
    window.location.href = "/";
  });

const navbarLogo = document.querySelector("#navbar__logo");
if (navbarLogo && testId) {
    navbarLogo.textContent = `JEE ADVANCE 20${Math.floor(parseInt(testId, 10) / 10)} Paper ${parseInt(testId, 10) % 10}`;
}

function toggleRadio(radio) {
  if (radio.dataset.checked === "true") {
      radio.checked = false;
      radio.dataset.checked = "false";
  } else {
      radio.checked = true;
      radio.dataset.checked = "true";
  }
}

function validateAndProceed() {
  const radio = document.getElementById("agree");
  const warningMessage = document.getElementById("warningMessage");

  if (!radio.checked) {
      warningMessage.style.display = "block";
      setTimeout(() => {
          warningMessage.style.display = "none";
      }, 5000);
  } else {
      warningMessage.style.display = "none";
      alert("Test Started!");
  }
}