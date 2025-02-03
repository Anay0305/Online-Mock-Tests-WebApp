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
const testId = urlParams.get('testid');

async function check_testid (){
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
}

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

async function gettypedata() {
    const payload = { 'test_id': testId };

    try {
        const response = await fetch(`${window.location.origin}/api/get_type_data/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

async function updatequestiontime(time) {
    const payload = { 
        'test_id': testId,
        'add_time': time
    };

    try {
        const response = await fetch(`${window.location.origin}/api/update_question_time/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

async function getquestiontypes() {
    const payload = { 'test_id': testId };

    try {
        const response = await fetch(`${window.location.origin}/api/get_question_types/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

async function getcurrentquestion() {
    const payload = { 'test_id': testId };

    try {
        const response = await fetch(`${window.location.origin}/api/get_current_question/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

async function updatecurrentquestion(subject, typee, number) {
    const payload = {
        'test_id': testId,
        'subject': subject,
        'type': typee,
        'number': number
    };

    try {
        const response = await fetch(`${window.location.origin}/api/update_current_question/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

async function displayQuestionHeaders() {
    const parts = ["PART-1: PHYSICS", "PART-2: CHEMISTRY", "PART-3: MATHEMATICS"];
    const types = await getquestiontypes();
    const sectionHeader = document.querySelector(".section-header");

    for (const part of parts) {
    for (const type in types) {
        const span = document.createElement("span");
        span.className = "section-heading";
        const partLetter = part.split(":")[1].trim()[0];
        span.id = `${partLetter}${type}`
        const textSpan = document.createElement("span");
        textSpan.className = "text";
        textSpan.textContent = `${part} (${type})`;
        span.appendChild(textSpan);

        span.addEventListener("click", async () => {
            const currentQuestion = await getcurrentquestion();
            for (const subject in currentQuestion) {
                for (const typee in currentQuestion[subject]) {
                    const id = `${subject}${typee}`;
                        if (`${partLetter}${type}` !== id) {
                            await updatecurrentquestion(partLetter, type, 1);
                            await displayQuestionInstruction();

                            const allSpans = document.querySelectorAll(".section-heading");
                            allSpans.forEach(s => {
                                s.classList.remove("highlight");
                            });

                            span.classList.add("highlight");
                        }
                    }}});
        sectionHeader.appendChild(span);
        
    highlightCurrentQuestion();
    }
    }
}

async function updateQuestionPanel(params) {
    
}

async function displayQuestionInstruction() {
    const data = await gettypedata();
    const questionInstruction = document.getElementById("questions_instruction")
    console.log(data)
    if ("message" in data){
    questionInstruction.innerHTML = data["message"]
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

        timerDisplay.innerText = `Left: ${hours.toString().padStart(2, '0')}:` +
                                 `${minutes.toString().padStart(2, '0')}:` +
                                 `${seconds.toString().padStart(2, '0')}`;
    }

    const QuestionTimer = document.getElementById("QuestionTimer");
    function updateQuestionTimer(Time) {
        console.log
        const hours = Math.floor(Time / 3600);
        const minutes = Math.floor((Time % 3600) / 60);
        const seconds = Time % 60;

        QuestionTimer.innerText = hours === 0 ? 
                                `${minutes.toString().padStart(2, '0')}:` +
                                `${seconds.toString().padStart(2, '0')}` :
                                `${hours.toString().padStart(2, '0')}:` +
                                `${minutes.toString().padStart(2, '0')}:` +
                                `${seconds.toString().padStart(2, '0')}`;
    }

    updateTimerDisplay();
    const initialTime = await updatequestiontime(0);
    if (initialTime && initialTime.time) {
        updateQuestionTimer(initialTime.time);
    }

    const timer = setInterval(async () => {
        secondsLeft--;
        updateTimerDisplay();
        const updatedTime = await updatequestiontime(1);
        if (updatedTime && updatedTime.time) {
            updateQuestionTimer(updatedTime.time);
        }

        if (secondsLeft < 0) {
            clearInterval(timer);
           // alert("Time's up!");
        }
    }, 1000);
}

async function highlightCurrentQuestion() {
    console.log("Start")
    const currentQuestion = await getcurrentquestion();

    if (!currentQuestion || Object.keys(currentQuestion).length === 0) {
        console.error("No current question data received.");
        return;
    }

    for (const subject in currentQuestion) {
        for (const type in currentQuestion[subject]) {
            const id = `${subject}${type}`;
            console.log(id)

            const span = document.getElementById(id);
            if (span) {
                span.classList.add("highlight");

                const allSpans = document.querySelectorAll(".section-heading");
                allSpans.forEach(s => {
                    if (s !== span && s.classList.contains("highlight")) {
                        s.classList.remove("highlight");
                    }
                });
            }
        }
    }
}

window.onload = async function () {
    await check_testid();
    await startTimer();
    await displayQuestionHeaders();
    await displayQuestionInstruction();
};