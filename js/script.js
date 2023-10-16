// The possible choices string descriptions are in the global choices array.
// This implementations works using an integer ID to represent each choice,
// which is indeed the corresponding index in the choice array.
// This assumes that i+1 wins i (and 0 wins choices.length-1) 
// (see function roundOutcome)
const choices = ['Rock','Paper','Scissors'];
const choicesLowerCase = choices.map(itm => itm.toLowerCase());
const playerName = 'You';
const computerName = 'Computer';
let playerScore;
let computerScore;
// These codes specify if a match is won or lost by the player, or if it is a tie
const winCode = 1;
const loseCode = -1;
const tieCode = 0;
const scoreToWin = 5;

/* ************************************************************** */

let gameInfoDiv = document.querySelector('#gameInfo');
let playerChoiceInfoDiv = document.querySelector('#playerChoiceInfo');
let roundOutcomeDiv = document.querySelector('#roundOutcome');
let playersInfoDiv = document.querySelector('#playersInfo');
let gameOutcomeDiv = document.querySelector('#gameOutcome');
let newGameDiv = document.querySelector('#newGame');
let playerMoveDiv = document.querySelector('#playerMove');
let playerNameDiv = document.querySelector('#playerName');
let playerScoreDiv = document.querySelector('#playerScore');
let computerMoveDiv = document.querySelector('#computerMove');
let computerNameDiv = document.querySelector('#computerName');
let computerScoreDiv = document.querySelector('#computerScore');
let playerChoiceListDiv = document.querySelector('#playerChoiceList');
let newGameBtn = document.querySelector('#newGameBtn');
let newRoundBtn = document.querySelector('#newRoundBtn');
let roundOutcomeP = document.querySelector('#roundOutcome>p');
let gameOutcomeP = document.querySelector('#gameOutcome>p');

playerNameDiv.textContent = playerName;
computerNameDiv.textContent = computerName;
let playerChoiceBtn = [];
for (let i=0;i<choices.length;i++){
	playerChoiceBtn[i] = document.createElement('button');
	playerChoiceBtn[i].type = 'button';
	playerChoiceBtn[i].classList.add('choicesBtn',choicesLowerCase[i]);
	playerChoiceBtn[i].playerChoice = i;
	playerChoiceBtn[i].textContent = choices[i];
	disableButton(playerChoiceBtn[i]);
	playerChoiceListDiv.appendChild(playerChoiceBtn[i]);
}

removeElement(playerChoiceInfoDiv);
removeElement(roundOutcomeDiv);
removeElement(playersInfoDiv);
removeElement(gameOutcomeDiv);

/* ************************************************************** */

/* Helper game functions ---------------------------------------- */

// Create a random choice ID for the opponent (computer)
function getComputerChoice(){
	return Math.floor(Math.random() * choices.length);
}

// Determine the outcome of a round, given the player and computer choices IDs
// This assumes that i+1 wins i (and 0 wins choices.length-1)
function roundOutcome(playerSelection, computerSelection) {
  if (playerSelection===computerSelection)
  	return [tieCode,`It's a tie!`]; 
  else if (((computerSelection+1)%choices.length) === playerSelection)
  	// The player wins, as playerSelection>computerSelection
  	// Note that playerSelection+1===computerSelection is tested, instead.
  	// (computerSelection+1)%choices.length) is used to wrap around playerSelection+1
  	// when playerSelection = choices.length-1
  	return [winCode,`You Win! ${choices[playerSelection]} beats ${choices[computerSelection]}`];
  else
  	return [loseCode,`You Lose! ${choices[computerSelection]} beats ${choices[playerSelection]}`];
}

function declareWinner(){
	if (playerScore==scoreToWin){
		return [winCode,`You won this game!`];
	} else if (computerScore==scoreToWin){
		return [loseCode,`You lost this game!`];
	} else {
		return [tieCode,``]; // no winner yet
	}
}

function introGameStr(){
	return `Welcome to ${choices.map(itm=>itm)} game!`;
}

/* Helper UI functions ------------------------------------------ */
function disableButton(btn){
	btn.setAttribute("disabled", true);
};

function enableButton(btn){
	btn.removeAttribute("disabled");
};

function disableArrayOfButtons(arr){
	arr.forEach(btn => {disableButton(btn);});
};

function enableArrayOfButtons(arr){
	arr.forEach(btn => {enableButton(btn);});
};

function removeElement(elem){
	elem.classList.add('removed');
};

function hideElement(elem){
	elem.classList.add('hidden');
};

function showElement(elem){
	elem.classList.remove('removed','hidden');
};


/* Buttons callbacks -------------------------------------------- */
function playRound(playerSelection){
	disableArrayOfButtons(playerChoiceBtn);
	removeElement(playerChoiceInfoDiv);
	showElement(roundOutcomeDiv);

	const computerSelection = getComputerChoice();

	playerMoveDiv.textContent = choices[playerSelection];
	computerMoveDiv.textContent = choices[computerSelection];

	// matchOutcome is an array: [associatedCode,stringDescription]
	let matchOutcome = roundOutcome(playerSelection, computerSelection);
	roundOutcomeP.textContent = matchOutcome[1];
	
	if (matchOutcome[0]==winCode){
		playerScore++;
		playerScoreDiv.textContent = playerScore;
	}else if (matchOutcome[0]==loseCode){
		computerScore++;
		computerScoreDiv.textContent = computerScore;
	}

	// gameOutcome is an array: [associatedCode,stringDescription]
	let gameOutcome = declareWinner();
	if(gameOutcome[0]){ // there is a winner for the game
		gameOutcomeP.textContent = gameOutcome[1];
		enableButton(newGameBtn);
		showElement(gameOutcomeDiv);
		showElement(newGameDiv);
		hideElement(newRoundBtn);	
	}
	else{
		enableButton(newRoundBtn);
	}
};

function startNewRound(){
	disableButton(newRoundBtn);
	showElement(playerChoiceInfoDiv);
	removeElement(roundOutcomeDiv);
	enableArrayOfButtons(playerChoiceBtn);
}

function startNewGame(){
	disableButton(newGameBtn);
	removeElement(gameOutcomeDiv);
	removeElement(roundOutcomeDiv);
	removeElement(gameInfoDiv);
	removeElement(newGameDiv);
	showElement(playerChoiceInfoDiv);
	showElement(playersInfoDiv);
	showElement(newRoundBtn);	
	
	playerScore=0;
	computerScore=0;
	playerScoreDiv.textContent = playerScore;
	computerScoreDiv.textContent = computerScore;



	enableArrayOfButtons(playerChoiceBtn);
};


newGameBtn.addEventListener('click',startNewGame);
playerChoiceBtn.forEach((btn,idx) => {btn.addEventListener('click',(event)=>{playRound(event.currentTarget.playerChoice)});});
newRoundBtn.addEventListener('click',startNewRound);