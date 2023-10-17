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
let newRoundDiv = document.querySelector('#newRound');
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
let playerMoveP = document.querySelector('#playerMove>p');
let computerMoveP = document.querySelector('#computerMove>p');

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
removeElement(newRoundDiv);
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
	elem.classList.remove('hidden');
};

function hideElement(elem){
	elem.classList.add('hidden');
	elem.classList.remove('removed');
};

function showElement(elem){
	elem.classList.remove('removed','hidden');
};


/* Buttons callbacks -------------------------------------------- */
async function playRound(playerSelection){
	disableArrayOfButtons(playerChoiceBtn);
	removeElement(playerChoiceInfoDiv);

	/*Temporary hide (instead of remove) the following two divs,
	  to avoid moving the other elements */
	hideElement(roundOutcomeDiv);
	hideElement(newRoundDiv);

	const computerSelection = getComputerChoice();

	playerMoveP.textContent = choices[playerSelection];
	computerMoveP.textContent = choices[computerSelection];
	showElement(playerMoveP);
	showElement(computerMoveP);

	moveAnimation(playerMoveImgLottie,segmentAfterWaitBeforeMove,
		segmentMove[playerSelection],segmentIdle[playerSelection]);
	moveAnimation(computerMoveImgLottie,segmentAfterWaitBeforeMove,
		segmentMove[computerSelection],segmentIdle[computerSelection]);	

	// matchOutcome is an array: [associatedCode,stringDescription]
	let matchOutcome = roundOutcome(playerSelection, computerSelection);

	roundOutcomeP.textContent = matchOutcome[1];
	showElement(roundOutcomeDiv);
	
	if (matchOutcome[0]==winCode){
		playerScore++;
		playerScoreDiv.textContent = playerScore;
		await reduceAnimationSpeedAfterWaiting(computerMoveImgLottie,waitingMoveInMs);
	} else if (matchOutcome[0]==loseCode){
		computerScore++;
		computerScoreDiv.textContent = computerScore;
		await reduceAnimationSpeedAfterWaiting(playerMoveImgLottie,waitingMoveInMs);
	} else {
		reduceAnimationSpeedAfterWaiting(computerMoveImgLottie,waitingMoveInMs);
		await reduceAnimationSpeedAfterWaiting(playerMoveImgLottie,waitingMoveInMs);
	}

	// gameOutcome is an array: [associatedCode,stringDescription]
	let gameOutcome = declareWinner();
	if(gameOutcome[0]){ // there is a winner for the game
		gameOutcomeP.textContent = gameOutcome[1];
		showElement(gameOutcomeDiv);
		showElement(newGameDiv);
		enableButton(newGameBtn);
	}
	else{
		showElement(newRoundDiv);
		enableButton(newRoundBtn);
	}
};

function startNewRound(){
	disableButton(newRoundBtn);
	removeElement(newRoundDiv);
	hideElement(roundOutcomeDiv);
	hideElement(playerMoveP);
	hideElement(computerMoveP);	
	showElement(playerChoiceInfoDiv);	
	waitingAnimation(playerMoveImgLottie);
	waitingAnimation(computerMoveImgLottie);
	enableArrayOfButtons(playerChoiceBtn);	
}

function startNewGame(){
	disableButton(newGameBtn);
	removeElement(gameInfoDiv);
	removeElement(newGameDiv);
	removeElement(newRoundDiv);
	removeElement(gameOutcomeDiv);
	hideElement(roundOutcomeDiv);
	hideElement(playerMoveP);
	hideElement(computerMoveP);

	playerScore=0;
	computerScore=0;
	playerScoreDiv.textContent = playerScore;
	computerScoreDiv.textContent = computerScore;

	showElement(playerChoiceInfoDiv);
	showElement(playersInfoDiv);



	waitingAnimation(playerMoveImgLottie);
	waitingAnimation(computerMoveImgLottie);
	enableArrayOfButtons(playerChoiceBtn);
};


newGameBtn.addEventListener('click',startNewGame);
playerChoiceBtn.forEach((btn,idx) => {btn.addEventListener('click',(event)=>{playRound(event.currentTarget.playerChoice)});});
newRoundBtn.addEventListener('click',startNewRound);

/* Animated images (Lottie format) ------------------------------ */
// https://css-tricks.com/animating-with-lottie/
// https://stackoverflow.com/questions/51160805/bodymovin-js-not-working-animation-is-not-rendering#:~:text=Instead%20of%20bodymovin%2C%20now%20we%20have%20to%20import,And%20that%27s%20all.%20it%20should%20fix%20the%20issue.

// All the images (animations) are generated from the same .json file
let lottieData = (element) => ({
	container: element,
	renderer: 'svg',
	loop: false,
	autoplay: false,
	path: 'https://lottie.host/a5e54894-3981-4e58-9658-37b29d13d6ee/RFy1A9AhQP.json'
});

/* The frame to use in different situations */
let segmentWait      = [16,24];
let segmentAfterWaitBeforeMove= [16,24];
let segmentBeforeMove= [5,24];
// the followings are arrays of segments to wait: see array choices to
// see the move they refer to
let segmentMove 	 = [[ 25, 82],[153,205],[ 89,141]]; 
let segmentIdle 	 = [[ 54, 82],[182,205],[ 118,141]]; 
let waitingMoveInMs = 1800;

let playerMoveImg = document.querySelector('#playerMoveImg');
let computerMoveImg = document.querySelector('#computerMoveImg');

let playerMoveImgLottie = bodymovin.loadAnimation(lottieData(playerMoveImg));
let computerMoveImgLottie = bodymovin.loadAnimation(lottieData(computerMoveImg));

function waitingAnimation(animation){
	animation.setSpeed(1.2);
	animation.loop = true;
	animation.playSegments(segmentWait, true);
}

// helper function to set a waiting time before executing the next line of code
// to be used with async/await sintax
// see https://stackoverflow.com/questions/14226803/wait-5-seconds-before-executing-next-line
const delay = ms => new Promise(res => setTimeout(res, ms));

async function reduceAnimationSpeedAfterWaiting(animation,waitingMoveInMs){
	await delay(waitingMoveInMs);
	animation.setSpeed(0.2);	
}

async function moveAnimation(animation,segmentBefore,segmentMove,segmentIdle){
	animation.setSpeed(1);
	animation.loop = true;
	animation.playSegments([segmentBefore,segmentMove,segmentIdle], true);
	// wait for the last animation to complete before reducing the speed
	// for now a timeout is set
	// TODO: instead of specifying the waiting time, wait until a complete event is fired 
	// by the last segment of animation, see, e.g.,
	// https://stackoverflow.com/questions/6902334/how-to-let-javascript-wait-until-certain-event-happens
}
