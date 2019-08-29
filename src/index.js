import style from "./main.css";
import axios from "axios";

var questions;
var currentQuestionIndex = 0;
var endGame = false;
var questionsArray = [];
var score = 0;
var numQuestionsAnswered = 1;

axios.get("https://opentdb.com/api.php?amount=10").then(res => {
  questions = res.data.results;
  createQuestions();
});

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

function wrongAnswer() {
  console.log("Wrong Answer");
}

function handleAnswer(answer) {
  numQuestionsAnswered++;
  if (answer) {
    if (numQuestionsAnswered >= questions.length) {
      handleEndGame();
    } else {
      createQuestions();
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
  })
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
}