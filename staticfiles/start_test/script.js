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
const testId = urlParams.get('testid');

fetch(`${window.location.origin}/api/get_tests_data/`)
    .then(response => response.json())
    .then(d => {
        let x = Object.keys(d);
        if (x.includes(testId)) {
            const navbarLogo = document.querySelector("#navbar__logo");
            if (navbarLogo && testId) {
                navbarLogo.textContent = `${d[testId].name}`;
            }
        } else {
            window.location.href = "/";
        }
    })
    .catch(error => {
        console.error("Error fetching JSON:", error);
        window.location.href = "/";
    });

async function gettimeleft() {
    const payload = { 'test_id': testId };

    try {
        const response = await fetch(`${window.location.origin}/api/get_time_left/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        return data.time_left;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

async function startTimer() {
    const timerDisplay = document.getElementById("timerDisplay");
    const timeLeft = await gettimeleft();
    if (timeLeft === false) return;

    let secondsLeft = timeLeft;

    function updateTimerDisplay() {
        const hours = Math.floor(secondsLeft / 3600);
        const minutes = Math.floor((secondsLeft % 3600) / 60);
        const seconds = secondsLeft % 60;

        timerDisplay.innerText = `${hours.toString().padStart(2, '0')}:` +
                                 `${minutes.toString().padStart(2, '0')}:` +
                                 `${seconds.toString().padStart(2, '0')} Left`;
    }

    // Immediately update UI before waiting for 1 second
    updateTimerDisplay();

    const timer = setInterval(() => {
        secondsLeft--;
        updateTimerDisplay();

        if (secondsLeft < 0) {
            clearInterval(timer);
            alert("Time's up!");
        }
    }, 1000);
}

window.onload = function () {
    startTimer();
};
