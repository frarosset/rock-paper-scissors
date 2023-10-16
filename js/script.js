// The possible choices string descriptions are in the global choices array.
// This implementations works using an integer ID to represent each choice,
// which is indeed the corresponding index in the choice array.
// This assumes that i+1 wins i (and 0 wins choices.length-1) 
// (see function roundOutcome)
const choices = ['Rock','Paper','Scissors'];
const choicesLowerCase = choices.map(itm => itm.toLowerCase());
const choicesLowerCaseInitials = choicesLowerCase.map(itm => itm[0]);
const uniqueInitials = choicesLowerCaseInitials.filter((val,idx,arr)=>
  arr.indexOf(val) === idx).length === choicesLowerCaseInitials.length;
const userName = 'You';
const computerName = 'Computer';
// These codes specify if a match is won or lost by the user, or if it is a tie
const winCode = 1;
const loseCode = -1;
const tieCode = 0;


// Get user choice ID for the user (player)
// The user can type in a prompt the full name of the choice 
// or just the first letter (if these are unique)
// The choice is case-insensitive
// If the input field is left empty ('' or undefined), a random ID is generated
// Return -1 if the choice is invalid (no string match)
function getPlayerChoice(){
	let descrStr1 = 'Make your choice: ' + choices + '\n';
	let descrStr2 = '- The typed string is case-insensitive;\n'
	let descrStr3 = uniqueInitials?'- You can optionally type only the first letter;\n':'';
	let descrStr4 = '- If you leave the field empty, a random choice is generated.';

	let userChoiceStr = prompt(descrStr1+descrStr2+descrStr3+descrStr4);

	if (userChoiceStr=='' || userChoiceStr==undefined)
		return getComputerChoice();

	userChoiceStr = userChoiceStr.trim().toLowerCase();

	let checkInitial = uniqueInitials && userChoiceStr.length==1;

	for (let i=0;i<choices.length; i++)
	{
		if (userChoiceStr === choicesLowerCase[i] ||
		(checkInitial && (userChoiceStr===choicesLowerCaseInitials[i])))
			return i;
	}

	return -1;
}


// Create a random choice ID for the opponent (computer)
function getComputerChoice(){
	return Math.floor(Math.random() * choices.length);
}

// Determine the outcome of a round, given the player and computer choices IDs
// This assumes that i+1 wins i (and 0 wins choices.length-1)
function roundOutcome(playerSelection, computerSelection) {
  if (playerSelection===computerSelection)
  	return tieCode;
  else if (((computerSelection+1)%choices.length) === playerSelection)
  	// The user wins, as playerSelection>computerSelection
  	// Note that playerSelection+1===computerSelection is tested, instead.
  	// (computerSelection+1)%choices.length) is used to wrap around playerSelection+1
  	// when playerSelection = choices.length-1
  	return winCode;
  else
  	return loseCode;
  
}

// Play a round, given the player and computer choices IDs, and return
// its outcome as an array with a string description and a code
function playRound(playerSelection, computerSelection) {
  let outcome = roundOutcome(playerSelection, computerSelection);

  switch(outcome){
  	 case tieCode:
  	 	return [`  It's a tie!`,outcome];
  	 	break;
  	 case winCode:
	 	return [`  You Win! ${choices[playerSelection]} beats ${choices[computerSelection]}`,outcome];
  	 	break;
  	 case loseCode: 
  	 	return [`  You Lose! ${choices[computerSelection]} beats ${choices[playerSelection]}`,outcome];
  	 	break;
  	 default: 	
  	 	console.error(`Invalid outcome`);
  }
}

function declareWinner(playerScore,computerScore){
	if (playerScore>computerScore){
		return `You won this game by ${playerScore} to ${computerScore}`;
	} else if (playerScore<computerScore){
		return `You lost this game by ${playerScore} to ${computerScore}`;
	} else{
		return `You neither won nor lost this game: it's a tie, ${playerScore} to ${computerScore}!`;
	}
}

// The main game function, where printFcn could be, e.g., console.log 
// or alert and specifies where the messages are displayed
function game(printFcn=console.log){
	const numOfRounds = 5;
	let playerScore=0;
	let computerScore=0;

	printFcn(introGameStr().toUpperCase() + '\n' + currentScore(playerScore,computerScore) + '\n');

	for (let i=0;i<numOfRounds; i++){
		const computerSelection = getComputerChoice();
		let playerSelection;

		do{
			playerSelection = getPlayerChoice();
		} while(playerSelection==-1)

		let outcome = playRound(playerSelection, computerSelection); 
      // outcome is an array: [stringDescription,associatedCode]
		outcome[1]==winCode ? playerScore++ : outcome[1]==loseCode ? computerScore++ : null;

		printFcn(currentRoundStr(i+1,numOfRounds).toUpperCase() + '\n' 
			+ currentChoices(playerSelection,computerSelection) + '\n' 
			+ outcome[0]+ '\n'
			+ currentScore(playerScore,computerScore) + '\n');
	}

	printFcn(declareWinner(playerScore,computerScore).toUpperCase());

	// Shown on the console how to start a new game
	console.log(descrStartConsoleGameStr());
}

function descrStartConsoleGameStr(){
	return `Type 'game()' or 'game(alert)' in the browser console to start a new game\n(with the alert argument, output messages are displayed in an alert box instead of the console)`;
}

function introGameStr(){
	return `Welcome to ${choices.map(itm=>itm)} game!`;
}

function currentScore(playerScore,computerScore){
	return `${userName}: ${playerScore} vs ${computerName}: ${computerScore}`;
}

function currentRoundStr(currentRound,numOfRounds){
	return `Round ${currentRound}/${numOfRounds}`;
}

function currentChoices(playerSelection,computerSelection){
	return `  ${userName} chose${userName.toLowerCase()=='you'?'':'s'} ${choices[playerSelection]}, ${computerName} choses ${choices[computerSelection]}`;
}

// Initially show on the console how to start a new game
console.log(descrStartConsoleGameStr());


/**********************************************/

// jQuery terminal interface 
//	(see https://itnext.io/how-to-create-interactive-terminal-like-website-888bb0972288)

/* Define the commands that can be typed on the console*/
let commands = {
	game: function(){
		game(termPrint);
		this.echo('\n' + descrStartTerminalGameStr() + '\n');
	},

	// https://terminal.jcubic.pl/examples.php
	// https://github.com/jcubic/jquery.terminal/wiki/Getting-Started#reading-text-from-user
	/*
   foo: async function() {
      this.echo('.');
      await sleep(1000);
      this.echo('.');
      await sleep(1000);
      this.echo('.');
   }
   */
}

//https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
//function sleep(ms) {
//  return new Promise(resolve => setTimeout(resolve, ms));
//}

let term;

$(function() {
    term = $('#terminal-div').terminal(commands, {
        greetings: descrStartTerminalGameStr()+'\n'
    });
});

function descrStartTerminalGameStr(){
	return colorText(`Type 'game' to start a new game`,'gi','MintCream');
}

function termPrint(str){
	alert(str);
	// TOFIX: these echo are displayed only after the caller function (game(termPRint)) is completed
	term.echo(str,{flush: true});
	term.flush();
}

// color the output in the terminal
// format: g (glow), b (bold), i (italic), u (underlined) 
function colorText(txt,format,txtColor,highlighColor='black'){
    return "[[" + format + ";" + txtColor + ";" + highlighColor + "]" + txt + "]";
}