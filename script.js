let wordsArray = []
let wordIndex = 0
let wordsInserted = 0;
let actualWordGiven = []
const alphabet = ["q","w","e","r","t","y","u","i","o","p","a","s","d","f","g","h","j","k","l","ñ","z","x","c","v","b","n","m",];
let cursorIndex = 0;
let correctLetters = 0

let mainTable = document.getElementById("main-table")
let rowsTableGroupSet = mainTable.getElementsByClassName("row")
let keyboardCaps = document.getElementsByClassName("key")
let keyboardDelete = document.getElementsByClassName("delete-key")[0]
let keyboardEnter = document.getElementsByClassName("enter-key")[0]
let instructionsButton = document.getElementsByClassName("instruccions-button")[0]
let closeInstructionsButton = document.getElementsByClassName("close-instruccions-button")[0]
let popupAlertContainer = document.getElementsByClassName("pop-up-alert")[0]
let popupInstruccionsContainer = document.getElementsByClassName("pop-up-instruccions")[0]
let overlay = document.getElementsByClassName("overlay")[0]
let resetButtonPopup = document.getElementsByClassName("reset-btn-popup")[0]
let resetButtonTitle = document.getElementsByClassName("reset-btn-title")[0]
let popupContent = document.getElementsByClassName("popup-content")[0]
let popupTitle = document.getElementsByClassName("popup-title")[0]

const fetchWordsJSON = async () => {
    let response = await fetch('words.json');
    let wordsObject = await response.json();
    return wordsObject;
}

const wordsMixer = (words) => {
    let wordsIndexArray = []
    while(wordsIndexArray.length < 35){
        let random = Math.floor(Math.random() * 35);
        if(words.indexOf(random) === -1) wordsIndexArray.push(random);
    }
    wordsArray = wordsIndexArray.map(index=>words[index])
}

const showMessage = (hasWon)=>{
    const correctWord = wordsArray[wordIndex].toLowerCase();
    if (hasWon) {
        popupTitle.innerHTML = "Ganaste!"
        popupContent.innerText = `Intentos: ${wordsInserted+1}/6`
        overlay.classList.remove("disabled")
        popupAlertContainer.classList.remove("hidden")
    } else {
        popupContent.innerText = `La palabra correcta era: ${correctWord.toUpperCase()}`
        popupTitle.innerHTML = `Perdiste :(`
        overlay.classList.remove("disabled")
        popupAlertContainer.classList.remove("hidden")
    }
}

const checkLetter = (indexLetter, letter, squareIndex) =>{
    const currentRow = rowsTableGroupSet[wordsInserted].getElementsByClassName("square")
    const correctWord = wordsArray[wordIndex].toLowerCase();
    const wordCorrectArray = correctWord.split('')

    if (indexLetter>=0) {
        if (letter==wordCorrectArray[squareIndex]) {
            currentRow[squareIndex].classList.add("correct")
            keyboardCaps[alphabet.indexOf(letter)].classList = "keyboard-cap key correct"
            correctLetters++
        } else {
            keyboardCaps[alphabet.indexOf(letter)].classList = "keyboard-cap key exist"
            currentRow[squareIndex].classList.add("exist")
        }
    } else {
        keyboardCaps[alphabet.indexOf(letter)].classList = "keyboard-cap key wrong"
        currentRow[squareIndex].classList.add("wrong")
        keyboardCaps[alphabet.indexOf(letter)].removeEventListener("click", listenerCaps)
    }
}

const checkWord = (wordUserArray) => {
    let squareIndex = 0;
    const correctWord = wordsArray[wordIndex].toLowerCase();
    wordUserArray.forEach(letter => {
        checkLetter(correctWord.indexOf(letter), letter, squareIndex)
        squareIndex++
    });

    if (wordUserArray.join("")==correctWord) {
        showMessage(true)
    } else if (wordsInserted==5) {
        showMessage(false)
    } else {
        correctLetters = 0
    }
    wordsInserted++
    cursorIndex = 0
}

const listenerCaps = event =>{
    if (cursorIndex<5) {
        let currentRow = rowsTableGroupSet[wordsInserted].getElementsByClassName("square")
        currentRow[cursorIndex].innerHTML = event.target.dataset.letter
        actualWordGiven.push(event.target.dataset.letter)
        cursorIndex++
    }
}

const keyboardDeleteHandler = () => {
    if (cursorIndex>=1) {
        cursorIndex--
        let currentRow = rowsTableGroupSet[wordsInserted].getElementsByClassName("square")
        currentRow[cursorIndex].innerHTML = ""
        actualWordGiven.pop()
    }
}

const keyboardEnterHandler = () => {
    checkWord(actualWordGiven)
    actualWordGiven = []
}

const resetButtonPopHandler = () => {
    overlay.classList.add("disabled")
    popupAlertContainer.classList.add("hidden")
    resetGame()
}

const instructionsBtnHandler = () => {
    overlay.classList.toggle("disabled")
    popupInstruccionsContainer.classList.toggle("hidden")
}


const closeInstructionsBtnHandler = () => {
    overlay.classList.toggle("disabled")
    popupInstruccionsContainer.classList.toggle("hidden")
}


const overlayHandler = () => {
    overlay.classList.toggle("disabled")
    popupInstruccionsContainer.classList.remove("hidden")
    popupAlertContainer.classList.remove("hidden")
    popupInstruccionsContainer.classList.add("hidden")
    popupAlertContainer.classList.add("hidden")
}

const resetGame= () => {
    Object.values(rowsTableGroupSet).forEach(row => {
        Object.values(row.getElementsByClassName("square")).forEach(square => {
            square.innerHTML = ""
            square.classList = "square"
        });
    });

    Object.values(keyboardCaps).forEach(cap=>{
        cap.classList = "keyboard-cap key"
    })

    Object.values(keyboardCaps).forEach(key=>{
        key.addEventListener("click", listenerCaps);   
    })

    wordIndex++
    wordsInserted = 0
    cursorIndex = 0
    actualWordGiven = []
}

instructionsButton.addEventListener("click", instructionsBtnHandler)
overlay.addEventListener("click", overlayHandler);
closeInstructionsButton.addEventListener("click", closeInstructionsBtnHandler)
keyboardEnter.addEventListener("click", keyboardEnterHandler)
keyboardDelete.addEventListener("click", keyboardDeleteHandler)
resetButtonPopup.addEventListener("click", resetButtonPopHandler);
resetButtonTitle.addEventListener("click", resetGame);

Object.values(keyboardCaps).forEach(key=>{
    key.addEventListener("click", listenerCaps);   
})

fetchWordsJSON().then(wordsObj => wordsMixer(wordsObj.words))
