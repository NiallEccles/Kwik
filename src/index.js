import style from "./main.css";
import axios from "axios";
var ProgressBar = require('progressbar.js');

var questions;
var currentQuestionIndex = 0;
var endGame = false;
var questionsArray = [];
var score = 0;
var numQuestionsAnswered = 1;
var timer;
var count = 10;
var difficulty = [
  'easy',
  'medium',
  'hard',
  'suprise me'
];
var currentDifficulty = difficulty[difficulty.length-1];

document.getElementById('startGame').addEventListener('click', ()=>{
  document.getElementById('startGame').style.display = 'none';
  document.getElementById('splash').style.display = 'none';
  startGame();
});

//document.getElementById('currentDifficulty').innerHTML = `Current Difficulty: ${currentDifficulty}`

// document.getElementById('difficulty').addEventListener('click',()=>{
//   difficulty.indexOf(currentDifficulty)+1 > difficulty.length -1 ? currentDifficulty = difficulty[0] : currentDifficulty = difficulty[difficulty.indexOf(currentDifficulty)+1];
//   document.getElementById('currentDifficulty').innerHTML = `Current Difficulty: ${currentDifficulty}`
// })

function createQuestions() {
  currentQuestionIndex < questions.length
    ? currentQuestionIndex++
    : (endGame = true);
  let content = document.querySelector("#questions");
  content.innerHTML = "";

  if (questions[currentQuestionIndex].difficulty === "easy") {
    document.querySelector("body").classList.remove("medium");
    document.querySelector("body").classList.remove("hard");
    document.querySelector("body").classList.add("easy");
  } else if (questions[currentQuestionIndex].difficulty === "medium") {
    document.querySelector("body").classList.remove("easy");
    document.querySelector("body").classList.remove("hard");
    document.querySelector("body").classList.add("medium");
  } else if (questions[currentQuestionIndex].difficulty === "hard") {
    document.querySelector("body").classList.remove("easy");
    document.querySelector("body").classList.remove("medium");
    document.querySelector("body").classList.add("hard");
  }

  content.innerHTML = `
        <h3>${questions[currentQuestionIndex].category}</h3>
        <h2>${questions[currentQuestionIndex].question}</h2>
    `;

  document.querySelector("#answers").innerHTML = `
    ${createAnswers(
      questions[currentQuestionIndex].correct_answer,
      questions[currentQuestionIndex].incorrect_answers
    )}`;

  document.getElementById("correct").addEventListener("click", () => {
    handleAnswer(true);
  });
  const wrongAnswers = document.querySelectorAll(".wrong");
  for (let k = 0; k < wrongAnswers.length; k++) {
    wrongAnswers[k].addEventListener("click", () => {
      handleAnswer(false);
    });
  }
}

function createAnswers(correct, wrong) {
  questionsArray.push(
    `<button class="heading" id="correct">${correct}</button>`
  );
  for (let i = 0; i < wrong.length; i++) {
    questionsArray.push(`<button class="wrong heading">${wrong[i]}</button>`);
  }
  shuffle(questionsArray);
  var myDivs = "";
  for (let j = 0; j < questionsArray.length; j++) {
    myDivs += `<div>${questionsArray[j]}</div>`;
  }
  questionsArray = [];
  return myDivs;
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  questionsArray = array;
}

function correctAnswer(){
  removeCountdown();
  resetTimer();
  startTimer();
}

function wrongAnswer() {
  removeCountdown();
  resetTimer();
  startTimer();
};

function handleAnswer(answer) {
  numQuestionsAnswered++;
  document.getElementById('q').innerHTML = numQuestionsAnswered;
  document.querySelector('#correct').classList.add('right-answer');
  clearInterval(timer);
  setTimeout(()=>{
    if (answer) {
      if (numQuestionsAnswered >= questions.length) {
        handleEndGame();
      } else {
        createQuestions();
        correctAnswer();
        score++;
      }
    } else {
      if (numQuestionsAnswered >= questions.length) {
          handleEndGame();
      } else {
        createQuestions();
        wrongAnswer();
      }
    }
  },3000)
}

function handleEndGame() {
  endGame = true;
  document.getElementById('container').style.display = 'none';
  document.querySelector("#questions").innerHTML = "";
  document.querySelector("#answers").innerHTML = "";
  document.getElementById("gameOver").innerHTML = `
  <h2>Game Finished!</h2>
  <h2>You scored: ${score}</h2>
  <button class="heading" id="newGame">New Game</button>
  `;
  document.getElementById('newGame').addEventListener('click',()=>{
      newGame();
  });
  clearInterval(timer);
}

function newGame(){
    axios.get("https://opentdb.com/api.php?amount=10").then(res => {
        questions = res.data.results;
        createQuestions();
    });
    currentQuestionIndex = 0;
    endGame = false;
    questionsArray = [];
    score = 0;
    numQuestionsAnswered = 1;
    document.getElementById("gameOver").innerHTML = '';
    document.getElementById('container').style.display = 'block';
    resetTimer();
    startTimer();
}

function startGame(){
    axios.get("https://opentdb.com/api.php?amount=10").then(res => {
    questions = res.data.results;
        createQuestions();
    });
    document.getElementById('q').innerHTML = numQuestionsAnswered;
    startTimer();
}

function startTimer(){
  var bar = '';
  bar = new ProgressBar.Circle('#timer', {
    strokeWidth: 6,
    easing: 'easeInOut',
    duration: 1,
    color: '#4f3dff',
    trailColor: '#eee',
    trailWidth: 1,
    svgStyle: null
  });


  timer = setInterval(()=>{
    count--;
    console.log(count);
    bar.animate(count/10);
    document.getElementById('time').innerHTML = count;
    if(count === 0){
      document.querySelector('#correct').classList.add('right-answer');
      handleAnswer(false);
    }
  },1000)
}

function resetTimer(){
  count = 10;
  clearInterval(timer);
  console.info('reset timer');
}

function removeCountdown(){
  let svgTimer = document.querySelector('#timer');
  svgTimer.removeChild(svgTimer.childNodes[0]);
}