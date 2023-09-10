const wordList = ["PRIDE", "MUMMY", "APPLE", "BEACH", "CHAIR", "PHAPS", "SHAPP", "SHAPE", "MUMMY"];
const MAX_GUESSES = 6;
const wordLength = 5;
var answer;
var guessesLeft = MAX_GUESSES;
const wordleBoard = document.getElementById("wordle-board");
var letterBoard = [];
var currentSumOfChoices = localStorage.getItem("sumOfChoices") ? localStorage.getItem("sumOfChoices") : 0;
var totalChancesPlayed = localStorage.getItem("totalChancesPlayed") ? localStorage.getItem("totalChancesPlayed") : 0;
currentSumOfChoices = parseInt(currentSumOfChoices);
totalChancesPlayed = parseInt(totalChancesPlayed);

function makeWordleBoard() {
    if(!totalChancesPlayed){
        $('#heading').html("Welcome to your first game of Wordle!");
    }
    for (let i = 0; i < MAX_GUESSES; i++) {
        for (let j = 0; j < wordLength; j++) {
            let block = document.createElement("div");
            block.className = "wordle-block";
            block.id = "block-" + i + j;
            wordleBoard.appendChild(block);
        }
        wordleBoard.appendChild(document.createElement("br"));
    }
}

function displayAverageGuesses() {
    if(totalChancesPlayed && currentSumOfChoices) {
        var avgGuesses = Math.ceil(currentSumOfChoices/totalChancesPlayed);
        $('#averageGuess').html(`<strong>Average guesses needed: </strong>${avgGuesses}`);
    }
}

function getRandomWord() {
    // const randomIndex = Math.floor(Math.random() * wordList.length);
    // answer = wordList[randomIndex];
    // console.log("The answer is " + answer);
    $.ajax({
        url: 'https://random-words5.p.rapidapi.com/getRandom?wordLength=5',
        headers: {
            'X-RapidAPI-Key': '187537549amsh08ca270110c7a07p1dc1afjsn24209e096c74',
            'X-RapidAPI-Host': 'random-words5.p.rapidapi.com'
        },
        method: 'GET',
        success: function (response) {
            answer = response;
            console.log("The answer is " + answer);
        },
        error: function (err) {
            console.log("error" + err);
        }
    });
}

getRandomWord();

function blockInfo(index, blockColor, letter) {
    this.blockId = "#block-" + (MAX_GUESSES - guessesLeft) + index;
    this.blockColor = blockColor;
    this.letter = letter;
    this.getBlockColorfromId = function () {
        $(this.blockId).css('background-color', this.blockColor);
        $(this.blockId).html(this.letter);
    }
}

function getBlockColor(index, letter, guessWord, answerObj, answerArr) {
    let color = "white";
    if (letter === answerArr[index]) {
        color = "green";
        if (answerObj[letter] == 0) {
            let lastindex = guessWord.substring(0, index).lastIndexOf(letter);
            var blockInfoObj = new blockInfo(lastindex, "white", letter);
            blockInfoObj.getBlockColorfromId();
        } else {
            answerObj[letter] = answerObj[letter] - 1;
        }
    } else if (answerArr.includes(letter) && answerObj[letter] != 0) {
        color = "yellow";
        answerObj[letter] = answerObj[letter] - 1;
    }
    if (color == "white" && !letterBoard.includes(letter)) {
        letterBoard.push(letter);
    }
    return color;
}

function getResult(text) {
    $('#result').html(`${text}<br><br>`);
    $('#new-game').css('display', "block");
    localStorage.setItem("totalChancesPlayed", totalChancesPlayed + 1);
}

function displayLetterBoard() {
    $('#usedLetterBoard').html(`<strong>Used letters that are not present in the answer: </strong>${letterBoard.join(', ')}<br>`);
}

function afterValidation(guessWord) {
    guessWord = guessWord.toLowerCase();
    var guessWordArr = Array.from(guessWord);
    if (answer === guessWord) {
        guessWordArr.forEach((letter, index) => {
            var blockInfoObj = new blockInfo(index, "green", letter);
            blockInfoObj.getBlockColorfromId();
        });
        getResult("Congratulations! You won!");
        const setSum = currentSumOfChoices + MAX_GUESSES - guessesLeft + 1;
        localStorage.setItem("sumOfChoices", setSum);
        guessesLeft = 0;
    } else {
        var answerArr = Array.from(answer);
        var answerObj = {}
        answerArr.forEach((letter) => {
            answerObj[letter] = answer.split(letter).length - 1;
        })
        guessWordArr.forEach((letter, index) => {
            let blockColor = getBlockColor(index, letter, guessWord, answerObj, answerArr);
            var blockInfoObj = new blockInfo(index, blockColor, letter);
            blockInfoObj.getBlockColorfromId();
        })
        if (guessesLeft == 1) {
            getResult("Game over! You ran out of guesses.");
        }
        guessesLeft--;
    }
    if (letterBoard.length > 0) {
        displayLetterBoard();
    }
}
function validateWord(word) {
    $.ajax({
        url: `https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=4c6e3e6e-059c-44fa-9ba9-5de8c47d066b`,
        method: 'GET',
        success: function (response) {
            if (response && response[0] && response[0].meta) {
                afterValidation(word);
            }
            else {
                $('#result').html('Please enter a valid word.<br><br>');
            }
        },
        error: function () {
            $('#result').html('Please enter a valid word.<br><br>');
        }
    });
}
function fillTheGuess() {
    if (guessesLeft > 0) {
        let guessWord = document.getElementById("guess-input").value;
        if (guessWord.length != 5) {
            $('#result').html('Please enter a 5-letter word.<br><br>');
            return;
        }
        if (answer) {
            validateWord(guessWord);
        }
    }
}

function restartWordle() {
    location.reload();
}

makeWordleBoard();
displayAverageGuesses();

$(document).ready(function () {
    document.getElementById("guess-button").addEventListener('click', fillTheGuess);
    document.getElementById("new-game").addEventListener('click', restartWordle);
})

