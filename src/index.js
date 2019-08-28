import style from "./main.css";
import axios from "axios";

var questions;
var currentQuestionIndex = 0;
var endGame = false;
var questionsArray = [];
var score = 0;
var numQuestionsAnswered = 0;

axios.get("https://opentdb.com/api.php?amount=10").then(res => {
  questions = res.data.results;
  createQuestions();
});

function createQuestions() {
  currentQuestionIndex < questions.length
    ? currentQuestionIndex++
    : (endGame = true);
  let content = document.querySelector("#questions");
  content.innerHTML = '';

  content.innerHTML = `
        <h3>${questions[currentQuestionIndex].category}</h3>
        <h1>${questions[currentQuestionIndex].question}</h1>
        ${createAnswers(
          questions[currentQuestionIndex].correct_answer,
          questions[currentQuestionIndex].incorrect_answers
        )}
    `;
  document.getElementById("correct").addEventListener("click", () => {
      handleAnswer(true);
  });
  const wrongAnswers = document.querySelectorAll('.wrong');
  for (let k = 0; k < wrongAnswers.length; k++) {
      wrongAnswers[k].addEventListener('click', ()=>{
        handleAnswer(false);
      })
  }
}

function createAnswers(correct, wrong) {
  questionsArray.push(`<button id="correct">${correct}</button>`);
  for (let i = 0; i < wrong.length; i++) {
    questionsArray.push(`<button class="wrong">${wrong[i]}</button>`);
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

function wrongAnswer(){
    console.log('Wrong Answer');
}

function handleAnswer(answer){
    if(answer){
        createQuestions();
        score++;
        numQuestionsAnswered++;
        console.log('number of questions answered', numQuestionsAnswered);
        if((numQuestionsAnswered) > questions.length){
          endGame = true;
          let content = document.querySelector("#questions");
          content.innerHTML = '';
          document.getElementById('gameOver').innerHTML = 'Game Finished';
        }
    } else {
        numQuestionsAnswered++;
        console.log('number of questions answered', numQuestionsAnswered);
        if((numQuestionsAnswered) > questions.length){
            endGame = true;
            let content = document.querySelector("#questions");
            content.innerHTML = '';
            document.getElementById('gameOver').innerHTML = 'Game Finished';
        } else {
            createQuestions();
            wrongAnswer();
        }
    }
    console.log('questions length', questions.length);
}