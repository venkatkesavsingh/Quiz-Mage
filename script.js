let questions = [];
let currentQuestionIndex = 0;
let score = 0;

fetch('questions.json')
  .then(res => res.json())
  .then(data => {
    questions = shuffleArray(data).slice(0, 10);
    loadQuestion();
  })
  .catch(err => {
    document.getElementById("quiz-box").innerHTML = "<p>❌ Failed to load questions.</p>";
    console.error(err);
  });

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function loadQuestion() {
  if (currentQuestionIndex >= questions.length) {
    showResult();
    return;
  }

  const q = questions[currentQuestionIndex];

  // ✅ Update question number and live score
  document.getElementById("question-number").innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  document.getElementById("live-score").innerText = `Score: ${score}`;

  document.getElementById("question").innerText = q.question;
  document.getElementById("feedback").innerText = "";

  const options = document.querySelectorAll(".option");
  options.forEach((btn, i) => {
    btn.innerText = q.options[i];
    btn.disabled = false;
    btn.classList.remove("correct", "wrong");
    btn.onclick = () => {
      const isCorrect = btn.innerText === q.answer;
      const correctSound = document.getElementById("correct-sound");
      const wrongSound = document.getElementById("wrong-sound");

      if (isCorrect) {
        btn.classList.add("correct");
        document.getElementById("feedback").innerText = "✅ Correct!";
        score++;
      } else {
        btn.classList.add("wrong");
        document.getElementById("feedback").innerText = `❌ Wrong! Correct answer: ${q.answer}`;
      }
      if (isCorrect) {
        correctSound.pause();
        correctSound.currentTime = 0;
        correctSound.play();
      }
      else {
        wrongSound.pause();
        wrongSound.currentTime = 0;
        wrongSound.play();
      }


      // ✅ Update live score immediately
      document.getElementById("live-score").innerText = `Score: ${score}`;

      options.forEach(o => o.disabled = true);

      setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
      }, 1500);
    };
  });
}

function showResult() {
  let message = "";
  
  if (score === questions.length) {
    message = "🎉 <strong>Congratulations!</strong> You got a perfect score!";
    startConfetti(); // 🎊 trigger confetti animation
  } else if (score < 3) {
    message = "😢 <strong>Better luck next time!</strong>";
  } else {
    message = "👏 <strong>Great job!</strong> Keep it up!";
  }

  if (score === questions.length) {
  document.getElementById("perfect-score-sound").play();
  }

  if (score <= 3) {
  document.getElementById("defeat-score-sound").play();
  }

  if (score >= 4 && score <= 9) {
  document.getElementById("applause-score-sound").play();
  }

  document.getElementById("quiz-box").innerHTML = `
    <h2>Quiz Completed!</h2>
    <p>${message}</p>
    <p>Your Score: ${score} / ${questions.length}</p>
    <button onclick="location.reload()">Play Again</button>
  `;
}

function startConfetti() {
  const duration = 3 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
