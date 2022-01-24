let wordsArray = []
let wordsInserted = 0;
let alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","Ñ","O","P","Q","R","S","U","V","W","X","Y","Z"];

let rowsGroupSet = document.getElementsByClassName("row")




async function fetchWordsJSON() {
    let response = await fetch('/words.json');
    let wordsObject = await response.json();
    wordsArray = wordsObject.words
}

function getOneWord(){
    let randomNumber = Math.floor(Math.random()*35)
    return wordsArray[randomNumber].split('')
}

function insertWord(word){
    let wordArray = word.split('')
    let currentRow = rowsGroupSet[wordsInserted].getElementsByClassName("square")
    for (let i = 0; i < wordArray.length; i++) {
        let letter = wordArray[i]
        let square = currentRow[i]
        square.innerText = letter
    }
    wordsInserted++
    checkWord("cuero", word)
}

function checkWord(wordGiven, wordChoosen){
    let wordGivenArray = wordGiven.split('')
    let wordChoosenArray = wordChoosen.split('')
    let letterThatExist = wordChoosenArray.filter(letter => wordGivenArray.indexOf(letter)>=0)
    let currentRow = rowsGroupSet[wordsInserted-1].getElementsByClassName("square")
    letterThatExist.forEach( letter => {
        if (wordGivenArray.indexOf(letter)==wordChoosenArray.indexOf(letter)) {
            currentRow[wordGivenArray.indexOf(letter)].style.backgroundColor = "green"
        } else {
            currentRow[wordGivenArray.indexOf(letter)].style.backgroundColor = "yellow"
        }
    });
}

function generateKeyboard(){
    let keyboardContainer = document.getElementById("keyboard-container")
    alphabet.forEach(letter => {
        keyboardContainer.innerHTML += `
        <div data-letter='${letter}' class='keyboard-letter'>${letter}</div>
        `
    });
}

fetchWordsJSON()