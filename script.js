let wordsArray = []
let wordIndex = 0
let wordsInserted = 0;
let actualWordGiven = []
let wordCorrect = ""
let alphabet = ["q","w","e","r","t","y","u","i","o","p","a","s","d","f","g","h","j","k","l","ñ","z","x","c","v","b","n","m",];
let cursorIndex = 0;
let correctLetters = 0

let rowsTableGroupSet = document.getElementsByClassName("row")
let keyboardCaps = document.getElementsByClassName("key")
let keyboardDelete = document.getElementsByClassName("delete-key")[0]
let keyboardEnter = document.getElementsByClassName("enter-key")[0]
let instruccionsButton = document.getElementsByClassName("instruccions-button")[0]
let closeInstruccionsButton = document.getElementsByClassName("close-instruccions-button")[0]
let popupAlertContainer = document.getElementsByClassName("pop-up-alert")[0]
let popupInstruccionsContainer = document.getElementsByClassName("pop-up-instruccions")[0]
let overlay = document.getElementsByClassName("overlay")[0]
let resetButtonPopup = document.getElementsByClassName("reset-btn-popup")[0]
let resetButtonTitle = document.getElementsByClassName("reset-btn-title")[0]
let popupContent = document.getElementsByClassName("popup-content")[0]
let popupTitle = document.getElementsByClassName("popup-title")[0]


async function fetchWordsJSON() {
    let response = await fetch('words.json');
    let wordsObject = await response.json();
    let wordsIndexArray = []
    while(wordsIndexArray.length < 35){
        let random = Math.floor(Math.random() * 35);
        if(wordsIndexArray.indexOf(random) === -1) wordsIndexArray.push(random);
    }
    wordsArray = wordsIndexArray.map(index=>wordsObject.words[index])
}

function checkWord(wordUserArray, wordCorrect){
    let wordCorrectArray = wordCorrect.split('')
    let currentRow = rowsTableGroupSet[wordsInserted].getElementsByClassName("square")
    let squareIndex = 0;
    wordUserArray.forEach(letter => {
        if (wordCorrect.indexOf(letter)>=0) {
    
            if (letter==wordCorrectArray[squareIndex]) {
        
        
                currentRow[squareIndex].classList.add("correct")
                keyboardCaps[alphabet.indexOf(wordUserArray[squareIndex])].classList = "keyboard-cap key correct"
                correctLetters++
            } else {
                keyboardCaps[alphabet.indexOf(wordUserArray[squareIndex])].classList = "keyboard-cap key exist"
                currentRow[squareIndex].classList.add("exist")
            }
        } else {
            keyboardCaps[alphabet.indexOf(wordUserArray[squareIndex])].classList = "keyboard-cap key wrong"
            currentRow[squareIndex].classList.add("wrong")
            keyboardCaps[alphabet.indexOf(wordUserArray[squareIndex])].removeEventListener("click", listenerCaps)
        }
        squareIndex++
    });
    if (wordUserArray.join("")==wordCorrect) {
        popupTitle.innerHTML = "Ganaste!"
        popupContent.innerText = `Intentos: ${wordsInserted+1}/6`
        overlay.classList.remove("disabled")
        popupAlertContainer.classList.remove("hidden")
    } else if (wordsInserted==6) {
        popupContent.innerText = `La palabra correcta era: ${wordCorrect.toUpperCase()}`
        popupTitle.innerHTML = `Perdiste :(`
        overlay.classList.remove("disabled")
        popupAlertContainer.classList.remove("hidden")

    } else {
        correctLetters = 0
    }
    wordsInserted++
    
    cursorIndex = 0
}

var listenerCaps = (event)=>{
    if (cursorIndex<5) {
        let currentRow = rowsTableGroupSet[wordsInserted].getElementsByClassName("square")
        currentRow[cursorIndex].innerHTML = event.target.dataset.letter
        actualWordGiven.push(event.target.dataset.letter)
        cursorIndex++
    }
}

Object.values(keyboardCaps).forEach(key=>{
    key.addEventListener("click", listenerCaps);   
})

keyboardDelete.addEventListener("click", function(){
    if (cursorIndex>=1) {
        cursorIndex--
        let currentRow = rowsTableGroupSet[wordsInserted].getElementsByClassName("square")
        currentRow[cursorIndex].innerHTML = ""
        actualWordGiven.pop()
    }
})

keyboardEnter.addEventListener("click", function(){
    checkWord(actualWordGiven, wordsArray[wordIndex].toLowerCase())
    actualWordGiven = []
})

resetButtonPopup.addEventListener("click", function(){
    overlay.classList.add("disabled")
    popupAlertContainer.classList.add("hidden")
    resetGame()
    wordIndex++
})

resetButtonTitle.addEventListener("click", function(){
    resetGame()
    wordIndex++
})

instruccionsButton.addEventListener("click", function(){
    overlay.classList.toggle("disabled")
    popupInstruccionsContainer.classList.toggle("hidden")
})

closeInstruccionsButton.addEventListener("click", function(){
    overlay.classList.toggle("disabled")
    popupInstruccionsContainer.classList.toggle("hidden")
})

overlay.addEventListener("click", function(){
    overlay.classList.toggle("disabled")
    popupInstruccionsContainer.classList.remove("hidden")
    popupAlertContainer.classList.remove("hidden")
    popupInstruccionsContainer.classList.add("hidden")
    popupAlertContainer.classList.add("hidden")
})

function resetGame(){
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

    wordsInserted = 0
    cursorIndex = 0
}

fetchWordsJSON()
