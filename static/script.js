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
        currentTheme++;
        if (currentTheme == themes.length) {
          currentTheme = 0;
        }
        root.style.setProperty("--main-accent", themes[currentTheme]);
        root.style.setProperty("--secondary", hexToRgb(themes[currentTheme]));
      });
});

document.addEventListener("DOMContentLoaded", function () {
  fetch("/static/database.json")
      .then(response => response.json())
      .then(data => {
        appendTimelineMessages(data.Papers, "memorable");
      });
    });

function AttemptedOrNot(paperid) {
  const payload = {
      test_id: paperid
  };
  fetch('/tests_data/check_attempt/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
  })
  .then(response => response.json())
  .then(data => {
      if (data.check === true) {
          console.log(`Paper attempted. Count: ${data.count}`);
          return true;
      } else {
          console.log("Paper not attempted.");
          return false;
      }
  })
  .catch(error => {
      console.error('Error:', error);
      return false;
  });
}

function appendTimelineMessages(messages, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const timelineList = container.querySelector("ul");
    messages.forEach(message => {
      const listItem = document.createElement("li");
      const h1 = message.title ? `<h1>${message.title}</h1>` : "";
      const button = AttemptedOrNot(message.id) ? `<div class="reattempt-btn" id="Start ${message.id}">Re-Attempt Test</div>
        <div class="result-btn" id="Res ${message.id}">View Result</div>` : `<div class="start-btn" id="Start ${message.id}">Start Test</div>`;
      const messageContent = `
        <div class="timeline__content">
          ${h1}
          <p>${message.message}</p>
        </div>
        ${button}
      `;
      listItem.innerHTML = messageContent;
      timelineList.appendChild(listItem);
    });
    messages.forEach(message => {
        const startBtn = document.getElementById(`Start ${message.id}`);
        const reattemptBtn = document.getElementById(`ReAttempt-${message.id}`);

        if (startBtn) {
            startBtn.addEventListener("click", () => {
              window.location.href = `/test?testid=${message.id}`;
            });
        }

        if (reattemptBtn) {
            reattemptBtn.addEventListener("click", () => {
                window.location.href = `/test?testid=${message.id}`;
            });
        }
    });
  }