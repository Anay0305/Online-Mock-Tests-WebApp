function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, 0.7)`;
}

const root = document.querySelector(":root");
const themeToggle = document.querySelector("#navbar__logo");
let currentTheme = 0;

themeToggle.addEventListener("click", () => {
  fetch("/static/database.json")
    .then(response => response.json())
    .then(data => {
      const themes = data.themes;
      currentTheme = (currentTheme + 1) % themes.length;
      root.style.setProperty("--main-accent", themes[currentTheme]);
      root.style.setProperty("--secondary", hexToRgb(themes[currentTheme]));
    });
});

document.addEventListener("DOMContentLoaded", function () {
  fetch("/static/database.json")
    .then(response => response.json())
    .then(data => {
      appendPapers(data.ids, "papers");
    });
});

async function AttemptedOrNot(paperid) {
  const usernameElement = document.getElementById("username");
  const username = usernameElement ? usernameElement.getAttribute("data-username") : "";
  const payload = {
    'username': username,
    'test_id': paperid
  };

  try {
    const response = await fetch('/tests_data/check_attempt/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data.check === true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

async function appendPapers(ids, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const timelineList = container.querySelector("ul");

  for (const id of ids) {
    const listItem = document.createElement("li");
    const h1 = message.title ? `<h1>20${Math.floor(parseInt(id) / 10)} Paper ${parseInt(id) % 10}</h1>` : "";

    const attempted = await AttemptedOrNot(id);
    
    const button = attempted
      ? `<div class="reattempt-btn" id="ReAttempt-${id}">Re-Attempt Test</div>
         <div class="result-btn" id="Res-${id}">View Result</div>`
      : `<div class="start-btn" id="Start-${id}">Start Test</div>`;

    const messageContent = `
      <div class="timeline__content">
        ${h1}
        <p>3 hrs</p>
      </div>
      ${button}
    `;

    listItem.innerHTML = messageContent;
    timelineList.appendChild(listItem);
  }

  ids.forEach(id => {
    const startBtn = document.getElementById(`Start-${id}`);
    const reattemptBtn = document.getElementById(`ReAttempt-${id}`);

    if (startBtn) {
      startBtn.addEventListener("click", () => {
        window.location.href = `/test?testid=${id}`;
      });
    }
    if (reattemptBtn) {
      reattemptBtn.addEventListener("click", () => {
        window.location.href = `/test?testid=${id}`;
      });
    }
  });
}