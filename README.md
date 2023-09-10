# Wordle Game

This project is aimed to create an interactive game similar to the NY Times Wordle game. Users will have 6 attempts to guess a 5-letter word, and feedback on their guesses is provided accordingly. 

Website Link - http://swapnilg.sgedu.site/Wordle/Wordle.html

## Project Overview

### Game Rules
- The player has 6 attempts to guess a 5-letter word.
- Each guess must be a valid 5-letter word.
- After each guess, the game provides feedback on the correctness of the letters:
  - Letters in the correct place are visually indicated.
  - Letters that are in the answer but in the wrong place are visually indicated.
- The game is responsive and works on screen sizes down to 600px.

### Features
- User input: Users can enter their guesses via an input text field and submit with a button.
- Word Generation:
  - Following two ways are implemented to get the answer:
    1. An array of words and randomly choose one for the answer.
    2. Retrieve a 5-letter word using an API. 
- End of Game:
  - If the user guesses the answer or uses all 6 guesses, a restart button is displayed.
  - The average number of guesses needed for the user on that device is tracked using local storage and displayed in the game.

## Getting Started

To run this project locally:

1. Clone this repository to your local machine.

2. Open the Wordle.html file in your web browser to start playing the Wordle game.

---APIs USed---

API to get a random 5 letter word - https://random-words5.p.rapidapi.com/getRandom?wordLength=5

API to validate a word - https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=yourKey
