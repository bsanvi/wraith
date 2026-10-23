
/* =========================================
   WRAITH — INTERACTIVE INVESTIGATION SYSTEM
========================================= */

// Screens
const homeScreen = document.getElementById("homeScreen");
const missionScreen = document.getElementById("missionScreen");
const investigationScreen = document.getElementById("investigationScreen");

// Navigation buttons
const startBtn = document.getElementById("startBtn");
const homeBtn = document.getElementById("homeBtn");
const investigateBtn = document.getElementById("investigateBtn");
const backToMissionBtn = document.getElementById("backToMissionBtn");
const homeFromGameBtn = document.getElementById("homeFromGameBtn");
const playAgainBtn = document.getElementById("playAgainBtn");

// Evidence elements
const evidenceItems = document.querySelectorAll(".evidence-item");
const evidenceTitle = document.getElementById("evidenceTitle");
const evidenceDescription = document.getElementById("evidenceDescription");
const evidenceFinding = document.getElementById("evidenceFinding");
const clueCount = document.getElementById("clueCount");

// Question elements
const questionPanel = document.getElementById("questionPanel");
const questionTitle = document.getElementById("questionTitle");
const questionDescription = document.getElementById("questionDescription");
const choicesContainer = document.getElementById("choices");
const questionFeedback = document.getElementById("questionFeedback");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");

// Progress elements
const xpValue = document.getElementById("xpValue");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

// Completion elements
const completionPanel = document.getElementById("completionPanel");
const finalXP = document.getElementById("finalXP");
const investigationActions = document.getElementById("investigationActions");


// =========================================
// GAME DATA
// =========================================

const evidenceData = [
    {
        title: "Failed Login — 02:08 AM",
        description:
            "The Orion server recorded an unsuccessful login attempt. " +
            "The account was not accessed during this attempt.",
        finding:
            "CLUE 1: An unsuccessful attempt alone does not prove an attack.",
        status: "REVIEWED"
    },
    {
        title: "Failed Login — 02:09 AM",
        description:
            "A second unsuccessful login occurred one minute after the first. " +
            "The repeated attempt is worth noting alongside other events.",
        finding:
            "CLUE 2: Repeated failures can indicate suspicious activity.",
        status: "REVIEWED"
    },
    {
        title: "Failed Login — 02:10 AM",
        description:
            "A third unsuccessful login was recorded. Three failures occurred " +
            "within a short period before a later successful login.",
        finding:
            "CLUE 3: The sequence of repeated failures deserves further review.",
        status: "REVIEWED"
    },
    {
        title: "Successful Login — 02:13 AM",
        description:
            "The server recorded a successful login from an unfamiliar location " +
            "three minutes after the last failed attempt. The location is not " +
            "recognized in this fictional case file.",
        finding:
            "CLUE 4: Verify the account owner and login context before deciding what happened.",
        status: "REVIEWED"
    }
];

const questions = [
    {
        title: "Question 1 — What pattern do you notice?",
        description:
            "Use the first three records to identify the most useful observation.",
        options: [
            "The server clock stopped working.",
            "Three failed login attempts occurred close together.",
            "The account was successfully accessed three times."
        ],
        answer: 1,
        explanation:
            "Correct! Three unsuccessful attempts occurred in quick succession. " +
            "This pattern deserves review, although it does not by itself prove an attack."
    },
    {
        title: "Question 2 — Which event needs closer review?",
        description:
            "Consider the final record and what happened before it.",
        options: [
            "The successful login from an unfamiliar location.",
            "The format of the timestamps.",
            "The first record only, without considering the others."
        ],
        answer: 0,
        explanation:
            "Correct! The unfamiliar successful login following repeated failures " +
            "is the strongest lead in this fictional case."
    },
    {
        title: "Question 3 — What should the analyst do next?",
        description:
            "You have identified suspicious activity. Choose a responsible next step.",
        options: [
            "Immediately assume the account owner is responsible.",
            "Ignore the event because the login succeeded.",
            "Verify the login with the account owner and review authorized security records."
        ],
        answer: 2,
        explanation:
            "Correct! Verify the activity and review relevant authorized records " +
            "before reaching a conclusion."
    }
];


// =========================================
// GAME STATE
// =========================================

let reviewedEvidence = new Set();
let currentQuestion = 0;
let completedQuestions = new Set();
let xp = 0;
let questionLocked = false;


// =========================================
// SCREEN NAVIGATION
// =========================================

function showScreen(targetScreen) {
    const screens = [
        homeScreen,
        missionScreen,
        investigationScreen
    ];

    screens.forEach(function (screen) {
        screen.classList.remove("active");
        screen.setAttribute("aria-hidden", "true");
    });

    targetScreen.classList.add("active");
    targetScreen.setAttribute("aria-hidden", "false");

    window.scrollTo({
        top: 0,
        behavior: "auto"
    });
}

startBtn.addEventListener("click", function () {
    showScreen(missionScreen);
});

homeBtn.addEventListener("click", function () {
    showScreen(homeScreen);
});

investigateBtn.addEventListener("click", function () {
    showScreen(investigationScreen);
});

backToMissionBtn.addEventListener("click", function () {
    showScreen(missionScreen);
});

homeFromGameBtn.addEventListener("click", function () {
    showScreen(homeScreen);
});


// =========================================
// EVIDENCE INSPECTION
// =========================================

evidenceItems.forEach(function (item) {
    item.addEventListener("click", function () {
        const index = Number(item.dataset.evidence);
        const evidence = evidenceData[index];

        if (!evidence) {
            return;
        }

        evidenceTitle.textContent = evidence.title;
        evidenceDescription.textContent = evidence.description;
        evidenceFinding.textContent = evidence.finding;

        // Mark this record as reviewed.
        reviewedEvidence.add(index);
        item.classList.add("reviewed", "selected");

        item.querySelector(".evidence-status").textContent =
            evidence.status;

        // Remove selection styling from other records.
        evidenceItems.forEach(function (otherItem) {
            if (otherItem !== item) {
                otherItem.classList.remove("selected");
            }
        });

        clueCount.textContent = reviewedEvidence.size + " / 4";

        // Unlock questions after all evidence has been reviewed.
        if (reviewedEvidence.size === evidenceData.length) {
            questionTitle.textContent = "Evidence reviewed — challenges unlocked";
            questionDescription.textContent =
                "You inspected all four records. Answer each question to close the case.";

            renderQuestion();
        } else {
            const remaining = evidenceData.length - reviewedEvidence.size;

            questionTitle.textContent = "Case questions locked";
            questionDescription.textContent =
                "Inspect " + remaining +
                " more evidence record(s) to unlock the challenges.";

            choicesContainer.innerHTML = "";

            const lockedMessage = document.createElement("button");
            lockedMessage.className = "choice";
            lockedMessage.textContent =
                "Review all four evidence records first.";
            lockedMessage.disabled = true;

            choicesContainer.appendChild(lockedMessage);
            questionFeedback.textContent = "";
            questionFeedback.className = "feedback";
            nextQuestionBtn.hidden = true;
        }

        updateProgress();
    });
});


// =========================================
// QUESTION SYSTEM
// =========================================

function renderQuestion() {
    if (reviewedEvidence.size !== evidenceData.length) {
        return;
    }

    if (completedQuestions.size === questions.length) {
        finishMission();
        return;
    }

    // Find the first question that has not been completed.
    currentQuestion = questions.findIndex(function (_, index) {
        return !completedQuestions.has(index);
    });

    if (currentQuestion < 0) {
        finishMission();
        return;
    }

    const question = questions[currentQuestion];

    questionLocked = false;
    questionTitle.textContent = question.title;
    questionDescription.textContent = question.description;
    questionFeedback.textContent = "";
    questionFeedback.className = "feedback";
    nextQuestionBtn.hidden = true;

    choicesContainer.innerHTML = "";

    question.options.forEach(function (option, index) {
        const button = document.createElement("button");
        button.className = "choice";

        const letter = document.createElement("span");
        letter.className = "choice-letter";
        letter.textContent = String.fromCharCode(65 + index);

        const text = document.createElement("span");
        text.textContent = option;

        button.appendChild(letter);
        button.appendChild(text);

        button.addEventListener("click", function () {
            checkAnswer(index, button);
        });

        choicesContainer.appendChild(button);
    });
}

function checkAnswer(selectedIndex, selectedButton) {
    if (questionLocked) {
        return;
    }

    const question = questions[currentQuestion];

    if (selectedIndex === question.answer) {
        questionLocked = true;

        selectedButton.classList.add("correct");

        xp += 100;
        completedQuestions.add(currentQuestion);

        questionFeedback.textContent =
            "✓ " + question.explanation + " +100 XP";

        questionFeedback.className = "feedback success";

        // Prevent changing answers after a correct answer.
        choicesContainer.querySelectorAll("button").forEach(function (button) {
            button.disabled = true;
        });

        nextQuestionBtn.textContent =
            completedQuestions.size === questions.length
                ? "CLOSE CASE ✓"
                : "NEXT QUESTION →";

        nextQuestionBtn.hidden = false;

        updateProgress();

    } else {
        selectedButton.classList.add("incorrect");
        selectedButton.disabled = true;

        questionFeedback.textContent =
            "Not quite. Recheck the evidence and try another answer.";

        questionFeedback.className = "feedback error";
    }
}

nextQuestionBtn.addEventListener("click", function () {
    renderQuestion();
});


// =========================================
// PROGRESS AND XP
// =========================================

function updateProgress() {
    xpValue.textContent = String(xp).padStart(3, "0");

    const totalSteps = evidenceData.length + questions.length;
    const completedSteps = reviewedEvidence.size + completedQuestions.size;
    const percentage = (completedSteps / totalSteps) * 100;

    progressText.textContent =
        completedSteps + " / " + totalSteps + " COMPLETE";

    progressFill.style.width = percentage + "%";
}


// =========================================
// MISSION COMPLETION
// =========================================

function finishMission() {
    questionPanel.hidden = true;
    completionPanel.hidden = false;
    investigationActions.hidden = true;

    finalXP.textContent = String(xp).padStart(3, "0");

    window.scrollTo({
        top: 0,
        behavior: "auto"
    });
}


// =========================================
// RESET AND REPLAY
// =========================================

function resetGame() {
    reviewedEvidence = new Set();
    completedQuestions = new Set();
    currentQuestion = 0;
    xp = 0;
    questionLocked = false;

    evidenceItems.forEach(function (item) {
        item.classList.remove("reviewed", "selected");
        item.querySelector(".evidence-status").textContent = "UNREVIEWED";
    });

    evidenceTitle.textContent = "Awaiting evidence selection";
    evidenceDescription.textContent =
        "Select an event from the evidence log to reveal its details.";

    evidenceFinding.textContent = "NO EVIDENCE SELECTED";
    clueCount.textContent = "0 / 4";

    questionPanel.hidden = false;
    completionPanel.hidden = true;
    investigationActions.hidden = false;

    questionTitle.textContent = "Case questions locked";
    questionDescription.textContent =
        "Review all four evidence records to unlock the investigation questions.";

    choicesContainer.innerHTML = "";

    const lockedMessage = document.createElement("button");
    lockedMessage.className = "choice";
    lockedMessage.textContent =
        "Evidence review required";
    lockedMessage.disabled = true;

    choicesContainer.appendChild(lockedMessage);

    questionFeedback.textContent = "";
    questionFeedback.className = "feedback";
    nextQuestionBtn.hidden = true;

    updateProgress();
    showScreen(homeScreen);
}

playAgainBtn.addEventListener("click", resetGame);


// =========================================
// INITIALIZE
// =========================================

resetGame();
