// Pages
const gamePage = document.getElementById("game-page");
const scorePage = document.getElementById("score-page");
const splashPage = document.getElementById("splash-page");
const countdownPage = document.getElementById("countdown-page");
// Splash Page
const startForm = document.getElementById("start-form");
const radioContainers = document.querySelectorAll(".radio-container");
const radioInputs = document.querySelectorAll("input");
const bestScores = document.querySelectorAll(".best-score-value");
// Countdown Page
const countdown = document.querySelector(".countdown");
// Game Page
const itemContainer = document.querySelector(".item-container");
// Score Page
const finalTimeEl = document.querySelector(".final-time");
const baseTimeEl = document.querySelector(".base-time");
const penaltyTimeEl = document.querySelector(".penalty-time");
const playAgainBtn = document.querySelector(".play-again");

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuesArray = [];
let bestScoreArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timeplayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = "0.0";

// Scroll
let valueY = 0;

// Referesh Splash Page Best Score
function bestScoreToDOM() {
  bestScores.forEach((best, i) => {
    // const bestScoreEl = best
    best.textContent = `${bestScoreArray[i].bestScore}s`;
  });
}

// Check local storage for best score , set bestscoreArray

function getSavedBestScore() {
  if (localStorage.getItem("bestScore")) {
    bestScoreArray = JSON.parse(localStorage.getItem("bestScore"));
  } else {
    bestScoreArray = [
      { question: 10, bestScore: finalTimeDisplay },
      { question: 25, bestScore: finalTimeDisplay },
      { question: 50, bestScore: finalTimeDisplay },
      { question: 99, bestScore: finalTimeDisplay },
    ];
    localStorage.setItem("bestScore", JSON.stringify(bestScoreArray));
  }
  bestScoreToDOM();
}

// Update Best Score Array
function updateBestScore() {
  bestScoreArray.forEach((score, i) => {
    // Selects correct best score to update
    if (questionAmount == score.question) {
      // Return Best Score as number with 1 dec
      const savedBest = Number(bestScoreArray[i].bestScore);
      // Update if the new final score is less or replacing zero
      if (savedBest === 0 || savedBest > finalTime) {
        bestScoreArray[i].bestScore = finalTimeDisplay;
      }
    }
  });
  bestScoreToDOM();
  // save to local stoarged
  localStorage.setItem("bestScore", JSON.stringify(bestScoreArray));
}

// Reset game
function playAgain() {
  gamePage.addEventListener("click", startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerGuesArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;
}

// Show score Page
function showScorePage() {
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1000);
  gamePage.hidden = true;
  scorePage.hidden = false;
}

// score to dom  and time
function scoreToDom() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timeplayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Base Time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  updateBestScore();
  // scroll to top  o
  itemContainer.scrollTo({
    top: 0,
    behavior: "instant",
  });
  showScorePage();
}

// Stop timer, process Result, go to score
function checkTime() {
  if (playerGuesArray.length == questionAmount) {
    clearInterval(timer);
    // Check for Wrong guess, add penalty time
    equationsArray.forEach((eq, i) => {
      if (eq.evaluated === playerGuesArray[i]) {
        // Corret Gues
      } else {
        // incorrect, add penalty
        penaltyTime += 0.5;
      }
    });
    finalTime = timeplayed + penaltyTime;
    scoreToDom();
  }
}

// add a tenth o a second to timePlayed
function addTime() {
  timeplayed += 0.1;
  checkTime();
}

// Start Timer when game page is clicked
function startTimer() {
  // Reset time
  timeplayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener("click", startTimer);
}

// Scroll, Store user Selection in playerGuesArr

function select(guessed) {
  // Scroll 80px
  valueY += 80;
  itemContainer.scroll(0, valueY);
  // Add player guess to array
  return guessed ? playerGuesArray.push("true") : playerGuesArray.push("false");
}

// Display Game page
function showGame() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}

// Get Random Number up to a max Number
function getRandomint(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomint(questionAmount);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomint(9);
    secondNumber = getRandomint(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: "true" };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomint(9);
    secondNumber = getRandomint(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomint(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: "false" };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
  // console.log(equationsArray.sort(() => (Math.random() > 0.5 ? 1 : -1)));
}

// Add equations to DOM
function equationToDom() {
  equationsArray.forEach((eq) => {
    // item
    const item = document.createElement("div");
    item.classList.add("item");
    // Equation Text
    const equationText = document.createElement("h1");
    equationText.textContent = eq.value;
    // Append
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = "";
  // Spacer
  const topSpacer = document.createElement("div");
  topSpacer.classList.add("height-240");
  // Selected Item
  const selectedItem = document.createElement("div");
  selectedItem.classList.add("selected-item");
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationToDom();
  // Set Blank Space Below
  const bottomSpacer = document.createElement("div");
  bottomSpacer.classList.add("height-500");
  itemContainer.appendChild(bottomSpacer);
}

// Display 3 2 1
function countdownStart() {
  let count = 3;
  countdown.textContent = count;
  const interval = setInterval(() => {
    count--;
    if (count === 0) {
      countdown.textContent = "Go!";
    } else if (count === -1) {
      showGame();
      clearInterval(interval);
    } else {
      countdown.textContent = count;
    }
  }, 1000);
}

//  Navigate from splash to countdown
function showCountDown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  populateGamePage();
  countdownStart();
}

// Get value from selected radio
function getRadioValue() {
  let radioValue;

  // Best Solution for not cecking other if one checked
  for (let i = 0; i <= radioInputs.length - 1; i++) {
    if (radioInputs[i].checked) {
      radioValue = radioInputs[i].value;
      if (radioValue) return radioValue;
    }
  }
}

// Form that decides amount of question

function selectQuestionAmount(e) {
  e.preventDefault();
  questionAmount = getRadioValue();
  questionAmount && showCountDown();
}

startForm.addEventListener("click", () => {
  radioContainers.forEach((radioEl) => {
    // Remove Selected label Styling
    radioEl.classList.remove("selected-label");
    // Add it back if radio check
    if (radioEl.children[1].checked) {
      radioEl.classList.add("selected-label");
    }
  });
});

// Event Listener
startForm.addEventListener("submit", selectQuestionAmount);
gamePage.addEventListener("click", startTimer);

// on Load
getSavedBestScore();

// shuffle method
// let unshuffled = ['hello', 'a', 't', 'q', 1, 2, 3, {cats: true}]

// let shuffled = unshuffled
//   .map((a) => ({sort: Math.random(), value: a}))
//   .sort((a, b) => a.sort - b.sort)
//   .map((a) => a.value)

// bacause ForEach is callback it can not return main function it only return its call back and forEach is not a loop so it can not be break or continue
// radioInputs.forEach(input=>{

//   if(input.checked){
//     radioValue = input.value
//   }
//   if(radioValue) {
//     return
//   }
// })
