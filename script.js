
const startBtn = document.getElementById("startBtn");
const mission = document.getElementById("mission");
const investigateBtn = document.getElementById("investigateBtn");
const investigation = document.getElementById("investigation");
const feedback = document.getElementById("feedback");
const detectiveFeedback = document.getElementById("detectiveFeedback");

startBtn.addEventListener("click", function () {
    mission.style.display = "block";
    mission.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    startBtn.textContent = "MISSION INITIALIZED ✓";
});

investigateBtn.addEventListener("click", function () {
    investigation.style.display = "block";

    investigation.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    feedback.textContent = "Investigation opened.";
});

const choices = document.querySelectorAll(".choice");

choices.forEach(function (choice) {
    choice.addEventListener("click", function () {
        const answer = choice.dataset.answer;

        if (answer === "suspicious") {
            detectiveFeedback.textContent =
                "CORRECT! An unfamiliar successful login after repeated failures deserves investigation. You earned 100 XP.";
        } else {
            detectiveFeedback.textContent =
                "Not quite. Review the sequence of failed attempts and the unfamiliar successful login, then try again.";
        }
    });
});
