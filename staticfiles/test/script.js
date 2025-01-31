document.addEventListener("DOMContentLoaded", function () {
  const usernameElement = document.getElementById("username");
  const username = usernameElement ? usernameElement.getAttribute("data-username") : "";

  const navbarMenu = document.querySelector(".navbar__menu");
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
const testId = parseInt(urlParams.get('testid'), 10);

fetch("/static/database.json")
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
    navbarLogo.textContent = `JEE ADVANCE 20${Math.floor(testId / 10)} Paper ${testId % 10}`;
}
