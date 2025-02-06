const urlParams = new URLSearchParams(window.location.search);
const testId = urlParams.get('testid');

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
    document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
      });
    document.getElementById("mark_for_review").addEventListener("click", async function() {
        await MarkForReview(this)});
    document.getElementById("back").addEventListener("click", async function() {
        await Back(this)});
    document.getElementById("save").addEventListener("click", async function() {
        await SaveAndNext(this)});
});

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

async function getanswertype() {
    const payload = { 'test_id': testId };

    try {
        const response = await fetch(`${window.location.origin}/api/get_answer_type/`, {
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

async function getanswer() {
    const payload = { 'test_id': testId };

    try {
        const response = await fetch(`${window.location.origin}/api/get_answer/`, {
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

async function getquestion() {
    const payload = { 'test_id': testId };

    try {
        const response = await fetch(`${window.location.origin}/api/get_question/`, {
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

async function getlastnumber() {
    const payload = { 'test_id': testId };

    try {
        const response = await fetch(`${window.location.origin}/api/get_last_number/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        return data.number;
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

async function updateanswer(answer) {
    const payload = {
        'test_id': testId,
        'answer': answer
    };

    try {
        const response = await fetch(`${window.location.origin}/api/update_answer/`, {
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

async function updateanswertype(typee) {
    const payload = {
        'test_id': testId,
        'type': typee,
    };

    try {
        const response = await fetch(`${window.location.origin}/api/update_answer_type/`, {
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
    let count = 0;

    for (const part of parts) {
    for (const type in types) {
        count ++;
        const span = document.createElement("span");
        span.className = "section-heading";
        const partLetter = part.split(":")[1].trim()[0];
        span.id = `${partLetter}${type}`
        const textSpan = document.createElement("span");
        textSpan.className = "text";
        textSpan.textContent = `${part} (${type})`;
        if (count === 1){
            span.style.borderLeft = "4px solid rgb(45 112 182)";
        }
        span.appendChild(textSpan);

        span.addEventListener("click", async () => {
            const currentQuestion = await getcurrentquestion();
            for (const subject in currentQuestion) {
                for (const typee in currentQuestion[subject]) {
                    const id = `${subject}${typee}`;
                        if (`${partLetter}${type}` !== id) {
                            await updatecurrentquestion(partLetter, type, 1);
                            await displayQuestionInstruction();
                            await displayQuestion();
                            await displayQuestionPalette();
                            const heading = document.getElementById("palette_heading")
                            heading.innerText = `${part} (${type})`;

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

async function displayQuestionInstruction() {
    const data = await gettypedata();
    const questionInstruction = document.getElementById("questions_instruction")
    if ("message" in data) {
        questionInstruction.innerHTML = data["message"];

        const question = document.getElementById("question_answer");
        question.style.top = (questionInstruction.offsetHeight + 64 + 32) + "px";
}
}

async function displayQuestionPalette() {
    const data = await getanswertype()
    const questionPalette = document.getElementById('question-palette');
    questionPalette.innerHTML = '';
    Object.keys(data).forEach(questionNumber => {
        const questionState = data[questionNumber];
        const questionItem = document.createElement('div');
        questionItem.classList.add('question-palette-item');
        
        const img = document.createElement('img');
        
        if (questionState === "U") {
            img.src = `${window.location.origin}/static/svg/not_visited.svg`;
            img.alt = 'Not Visited';
        } else if (questionState === "S") {
            img.src = `${window.location.origin}/static/svg/not_answered.svg`;
            img.alt = 'Not Answered';
        } else if (questionState === "A") {
            img.src = `${window.location.origin}/static/svg/answered.svg`;
            img.alt = 'Answered';
        } else if (questionState === "M") {
            img.src = `${window.location.origin}/static/svg/marked_for_review.svg`;
            img.alt = 'Marked for Review';
        } else if (questionState === "AM") {
            img.src = `${window.location.origin}/static/svg/answered_and_marked_for_review.svg`;
            img.alt = 'Answered and Marked for Review';
        } 
        
        const span = document.createElement('span');
        span.textContent = questionNumber;
        questionItem.addEventListener("click", async () => {
            const currentQuestion = await getcurrentquestion();
            const subject = Object.keys(currentQuestion)[0];
            const typee = Object.keys(currentQuestion[subject])[0];
        
            if (subject && typee) {
                await updatecurrentquestion(subject, typee, questionNumber);
                await displayQuestion();
                await displayQuestionPalette();
            }
        });
        
        questionItem.appendChild(img);
        questionItem.appendChild(span);

        questionPalette.appendChild(questionItem);
    });
}

async function displayQuestion() {
    const current = await getcurrentquestion();
    let check = true;
    const sectionHeader = document.getElementById("section-header");
    if ("P" in current) {
        if (`${sectionHeader.firstElementChild.id.substring(1)}` in current["P"]){
            if (current["P"][`${sectionHeader.firstElementChild.id.substring(1)}`] === "1"){
                const back = document.getElementById("back");
                back.classList.remove("low__button");
                back.classList.add("disabled_button");
                check = false;
            }
        }
    }
    if (check) {
        const back = document.getElementById("back");
        if (back.classList.contains("disabled_button")){
            back.classList.remove("disabled_button");
            back.classList.add("low__button");
        }
    }
    let check1 = true;
    if ("M" in current){
        const last = await getlastnumber();
        if (`${sectionHeader.lastElementChild.id.substring(1)}` in current["M"]){
            if (current["M"][`${sectionHeader.lastChild.id.substring(1)}`] === `${last}`){
                const mfr = document.getElementById("mark_for_review");
                const save = document.getElementById("save");
                mfr.innerHTML = 'Mark for Review';
                save.innerHTML = 'Save';
                check1 = false;
            }
        }
    }
    if (check1) {
        const mfr = document.getElementById("mark_for_review");
        const save = document.getElementById("save");
        mfr.innerHTML = 'Mark for Review & Next';
        save.innerHTML = 'Save & Next';
    }
    const data = await getquestion();
    const question = document.getElementById("question");
    const number = document.getElementById("QuestionNo");
    const UserInputAnswer = await getanswer();
    number.innerHTML = `Question No. ${data.number}`;
    question.innerHTML = data.Question;
    const answerSection = document.getElementById("answer-section");
    answerSection.innerHTML = "";
    if ("Option 1" in data){
        const answerChoices = document.createElement('div');
        answerChoices.classList.add('answer-choices');
        const list = ['1', '2', '3', '4']
        for (const i of list) {
            const Choice = document.createElement('div');
            Choice.classList.add('answer-choices-item');
            const option = document.createElement('input');
            const answer = document.createElement('span');
            answer.innerHTML = data[`Option ${i}`];
            option.type = 'radio';
            option.name = `option${i}`;
            option.id = i;
            option.dataset.checked = 'false';
            if (UserInputAnswer.answer.includes(i)){
                option.dataset.checked = true;
                option.checked = true;
            }
            option.onclick = function() { toggleChoice(this); };
            Choice.appendChild(option);
            Choice.appendChild(answer);
            answerChoices.appendChild(Choice);
        }
        answerSection.appendChild(answerChoices);
    }
    else{
        const answerInteger = document.createElement("div");
        answerInteger.className = "answer-integer";

        const keypadDisplay = document.createElement("div");
        keypadDisplay.className = "keypad-display";
        keypadDisplay.id = "AnswerInputDisplay";
        keypadDisplay.innerHTML = UserInputAnswer.answer;
    
        const backspaceButton = document.createElement("button");
        backspaceButton.className = "keypad-button-backspace";
        backspaceButton.textContent = "Backspace";
        backspaceButton.onclick = () => appendtoAnswer("back");
    
        const keypadContainer = document.createElement("div");
        keypadContainer.className = "keypad-container";
    
        const buttons = [
            "1", "2", "3",
            "4", "5", "6",
            "7", "8", "9",
            "sign", "0", "."
        ];
    
        buttons.forEach(value => {
            const button = document.createElement("button");
            button.className = "keypad-button";
            button.textContent = value === "sign" ? "-/+" : value;
            button.onclick = () => appendtoAnswer(value);
            keypadContainer.appendChild(button);
        });
    
        answerInteger.appendChild(keypadDisplay);
        answerInteger.appendChild(backspaceButton);
        answerInteger.appendChild(keypadContainer);
        answerSection.appendChild(answerInteger);
    }
    const answertype = await getanswertype();
    const type = answertype[data.number];
    if (type === "U"){
        await updateanswertype("S");
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
    const currentQuestion = await getcurrentquestion();

    if (!currentQuestion || Object.keys(currentQuestion).length === 0) {
        console.error("No current question data received.");
        return;
    }

    for (const subject in currentQuestion) {
        for (const type in currentQuestion[subject]) {
            const id = `${subject}${type}`;
            const heading = document.getElementById("palette_heading")
            let part = "";
            if (subject==="P"){
                part = "PART-1: PHYSICS";
            }
            if (subject==="C"){
                part = "PART-2: CHEMISTRY";
            }
            if (subject==="M"){
                part = "PART-3: MATHEMATICS";
            }
            heading.innerText = `${part} (${type})`;

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

function togglePanel() {
    const panel = document.querySelector('.side-panel');
    const openBtn = document.querySelector('.open-btn');
    const sectionHeader = document.querySelector('.section-header');
    const low = document.querySelector('.low');
    const currentRight = window.getComputedStyle(panel).right;
  
    if (currentRight === '0px') {
      panel.style.right = '-325px';
      openBtn.style.right = '0';
      openBtn.innerHTML = "&#11106;";
      sectionHeader.style.marginRight = '0';
      low.style.marginRight = '0';
    } else {
      panel.style.right = '0';
      openBtn.style.right = '325px';
      openBtn.innerHTML = "&#11104;";
      sectionHeader.style.marginRight = '325px';
      low.style.marginRight = '325px';
    }
}

function toggleChoice(element) {
    const questionInstruction = document.getElementById("questions_instruction")
    let allowMultiple = questionInstruction.innerHTML.includes("One or more");

    if (element.dataset.checked === 'true') {
        element.checked = false;
        element.dataset.checked = false;
    }
    else{
        if (allowMultiple) {
            element.checked = true;
            element.dataset.checked = true;
        } else {
            const allRadios = document.querySelectorAll('input[type="radio"]');
            allRadios.forEach(radio => {
                if (radio !== element) {
                    radio.checked = false;
                    radio.dataset.checked = false;
                }
            });
            element.checked = true;
            element.dataset.checked = true;
        }
    }
}

function appendtoAnswer(data) {
    const AnswerInput = document.getElementById("AnswerInputDisplay");
    if (data === "back"){
        AnswerInput.innerHTML = AnswerInput.innerHTML.length > 0 ? AnswerInput.innerHTML.substring(0, AnswerInput.innerHTML.length - 1) : AnswerInput.innerHTML;
    }
    else if (data === "sign"){
        if (AnswerInput.innerHTML.includes("-")){
            AnswerInput.innerHTML = AnswerInput.innerHTML.slice(1);
        }
        else {
            AnswerInput.innerHTML = "-" + AnswerInput.innerHTML;
        }
    }
    else if (data === "."){
        if  (!AnswerInput.innerHTML.includes("."))
            AnswerInput.innerHTML = AnswerInput.innerHTML + ".";
    }
    else {
        AnswerInput.innerHTML = AnswerInput.innerHTML + data
    }
}

async function Back(element) {
    if (element.classList.contains("low__button")){
        const current = await getcurrentquestion();
        const sectionHeader = document.getElementById("section-header");
        for (const i in current){
            for (const j in current[i]){
                if (current[i][j] !== "1"){
                    await updatecurrentquestion(i, j, `${parseInt(current[i][j])-1}`);
                    await displayQuestion();
                }
                else {
                    const childElement = sectionHeader.querySelector(`#${i+j}`);
                    const previousChild = childElement ? childElement.previousElementSibling : null;
                    await updatecurrentquestion(previousChild.id[0], previousChild.id.substring(1), "last");
                    await displayQuestion();
                    await highlightCurrentQuestion();
                }
            }
        }
    }
}

async function MarkForReview(element) {
    const AnswerInput = document.getElementById("AnswerInputDisplay");
    if (AnswerInput) {
        if (AnswerInput.innerHTML === '') {
            await updateanswertype("M");
        }
        else {
            await updateanswer(`${AnswerInput.innerHTML}`)
            await updateanswertype("AM");
        }
    }
    else {
        const allRadios = document.querySelectorAll('input[type="radio"]');
        let x = [];
        for (const radio of allRadios) {
            if (radio.checked) {
                x.push(radio.id);
            }
        }
        if (x.length === 0) {
            await updateanswer(x);
            await updateanswertype("M");
        }
        else {
            await updateanswer(x);            
            await updateanswertype("AM");
        }
    }
    if (element.innerHTML.includes("Next")){
        const current = await getcurrentquestion();
        const sectionHeader = document.getElementById("section-header");
        const last = await getlastnumber();
        for (const i in current){
            for (const j in current[i]){
                if (current[i][j] !== `${last}`){
                    await updatecurrentquestion(i, j, `${parseInt(current[i][j])+1}`);
                    await displayQuestion();
                }
                else {
                    const childElement = sectionHeader.querySelector(`#${i+j}`);
                    const NextChild = childElement ? childElement.nextElementSibling : null;
                    await updatecurrentquestion(NextChild.id[0], NextChild.id.substring(1), "1");
                    await displayQuestion();
                    await highlightCurrentQuestion();
                }
            }
        }
    }
    await displayQuestionPalette();
}

async function SaveAndNext(element) {
    const AnswerInput = document.getElementById("AnswerInputDisplay");
    if (AnswerInput) {
        if (AnswerInput.innerHTML === '') {
            await updateanswertype("S");
        }
        else {
            await updateanswer(`${AnswerInput.innerHTML}`)
            await updateanswertype("A");
        }
    }
    else {
        const allRadios = document.querySelectorAll('input[type="radio"]');
        let x = [];
        for (const radio of allRadios) {
            if (radio.checked) {
                x.push(radio.id);
            }
        }
        if (x.length === 0) {
            await updateanswer(x);
            await updateanswertype("S");
        }
        else {
            await updateanswer(x);
            await updateanswertype("A");
        }
    }
    if (element.innerHTML.includes("Next")){
        const current = await getcurrentquestion();
        const sectionHeader = document.getElementById("section-header");
        const last = await getlastnumber();
        for (const i in current){
            for (const j in current[i]){
                if (current[i][j] !== `${last}`){
                    await updatecurrentquestion(i, j, `${parseInt(current[i][j])+1}`);
                    await displayQuestion();
                }
                else {
                    const childElement = sectionHeader.querySelector(`#${i+j}`);
                    const NextChild = childElement ? childElement.nextElementSibling : null;
                    await updatecurrentquestion(NextChild.id[0], NextChild.id.substring(1), "1");
                    await displayQuestion();
                    await highlightCurrentQuestion();
                }
            }
        }
    }
    await displayQuestionPalette();
}

function ClearResponse(element) {
    const allRadios = document.querySelectorAll('input[type="radio"]');
    allRadios.forEach(radio => {
        radio.checked = false;
        radio.dataset.checked = false;
    });
    const AnswerInput = document.getElementById("AnswerInputDisplay");
    if (AnswerInput) {
        AnswerInput.innerHTML = '';
    }
}

window.onload = async function () {
    await check_testid();
    await startTimer();
    await displayQuestionHeaders();
    await displayQuestionInstruction();
    await displayQuestion();
    await displayQuestionPalette();
};