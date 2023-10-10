// This implementations works using integer choices (IDs).
// The corresponding textual description are stored in
// the global choices array.
// In particular, the integer assigned to a choice, is the
// index in the choices array, where the corresponding string
// is located. 
// This assumes that i+1 wins i (and 0 wins choices.length-1) 
// (see function roundOutcome)
// Global variables:
const choices = ['Rock','Paper','Scissors'];
const choicesLowerCase = choices.map(itm => itm.toLowerCase());
const uniqueInitials = choicesLowerCase.map(itm => itm[0]).filter((val, idx, arr)=>
  arr.indexOf(val) === idx).length === choicesLowerCase.length;
const userName = 'You';
const computerName = 'Computer';


// Get user choice for the user (player)
// A prompt is used
// The user can type the full name of the choice or just the first letter (if these are unique)
// The choice is case-insensitive
// If the input field is left empty (undefined value), a random value is generated
// Output: the ID of the choice (-1 if the choice is invalid)
function getPlayerChoice(){
	let descrStr1 = 'Make your choice: ' + choices + '\n';
	let descrStr2 = '- The typed string is case-insensitive;\n'
	let descrStr3 = uniqueInitials?'- You can optionally type only the first letter;\n':'';
	let descrStr4 = '- If you leave the field empty, a random choice is generated.';

	let userChoiceStr = prompt(descrStr1+descrStr2+descrStr3+descrStr4);

	if (userChoiceStr=='' || userChoiceStr==undefined)
		return getComputerChoice();

	// trim initial and final white spaces, and convert to lowercase
	userChoiceStr = userChoiceStr.trim().toLowerCase();

	let checkInitial = uniqueInitials && userChoiceStr.length==1;

	for (let i=0;i<choices.length; i++)
	{
		if (userChoiceStr === choicesLowerCase[i] ||
		(checkInitial && (userChoiceStr===choicesLowerCase[i][0])))
			return i;
	}

	/* Return -1 if no string match */
	return -1;
}


// Create a random choice for the opponent (computer)
// Output: the ID of the choice
function getComputerChoice(){
	return Math.floor(Math.random() * choices.length);
}

// Determine the outcome of a round
// This assumes that i+1 wins i (and 0 wins choices.length-1)
// Input: player and computer choices IDs
// Output: 1 if the user wins, 0: if it is a tie, -1: if the user loses
function roundOutcome(playerSelection, computerSelection) {
  if (playerSelection===computerSelection)
  	// same choice: it's a tie
  	return 0;
  else if (((computerSelection+1)%choices.length) === playerSelection)
  	// the user wins, as playerSelection>computerSelection
  	// Note that playerSelection+1===computerSelection is tested, instead.
  	// (computerSelection+1)%choices.length) is used to wrap around playerSelection+1
  	// when playerSelection= choices.length-1
  	return 1;
  else
  	return -1;
  
}

// Plays a round
// Input: player and computer choices IDs
// Output: the outcome of a round, as a string
function playRound(playerSelection, computerSelection) {
  let outcome = roundOutcome(playerSelection, computerSelection);

  switch(outcome){
  	 case 0:
  	 	return [`  It's a tie!`,0];
  	 	break;
  	 case 1:
	 	return [`  You Won! ${choices[playerSelection]} beats ${choices[computerSelection]}`,1];
  	 	break;
  	 case -1: 
  	 	return [`  You Lose! ${choices[computerSelection]} beats ${choices[playerSelection]}`,-1];
  	 	break;
  	 default: 	
  	 	console.error('Invalid outcome');
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



// the main game function
// printFcn could be, e.g., console.log or alert
// and specifies where the messages are displayed
function game(printFcn=console.log){
	const numOfRounds = 5;
	let playerScore=0;
	let computerScore=0;

	printFcn(introGameStr().toUpperCase() + '\n' + currentScore(playerScore,computerScore) + '\n');

	for (let i=0;i<numOfRounds; i++){
		// Get players'choices
		const computerSelection = getComputerChoice();
		let playerSelection;

		do{
			playerSelection = getPlayerChoice();
		} while(playerSelection==-1)

		// Declare the outcome of this match
		let outcome = playRound(playerSelection, computerSelection); 

		// Update score
		outcome[1]==1 ? playerScore++ : outcome[1]==-1 ? computerScore++ : null;

		// Print the result of this match
		//printFcn(currentRoundStr(i+1,numOfRounds).toUpperCase());
		//printFcn(currentChoices(playerSelection,computerSelection));
		//printFcn(outcome[0]);
		//printFcn(currentScore(playerScore,computerScore));

		printFcn(currentRoundStr(i+1,numOfRounds).toUpperCase() + '\n' 
			+ currentChoices(playerSelection,computerSelection) + '\n' 
			+ outcome[0]+ '\n'
			+ currentScore(playerScore,computerScore) + '\n');
	}

	// Declare final winner
	printFcn(declareWinner(playerScore,computerScore).toUpperCase());

	// This next message is always shown on the console
	console.log(descrStartConsoleGameStr());
}




/* Some functions to display text */
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


/*This is displayed on the console once the script is loaded, 
  to tell the user how to start a new game from the console*/
console.log(descrStartConsoleGameStr());


/**********************************************/

/* jQuery terminal interface 
	 (see https://itnext.io/how-to-create-interactive-terminal-like-website-888bb0972288) */

/* Define the commands that can be typed on the console*/
let commands = {
	game: function(){
		game(termPrint);
		this.echo('\n' + descrStartTerminalGameStr() + '\n');
	},

	// https://terminal.jcubic.pl/examples.php
	// https://github.com/jcubic/jquery.terminal/wiki/Getting-Started#reading-text-from-user
	//foo: async function() {
  //      this.echo('.');
  //      await sleep(1000);
  //     this.echo('.');
  //      await sleep(1000);
  //      this.echo('.');
  //  }
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
	/*TOFIX: these echo are displayed only after the caller function (game(termPRint)) is completed*/
	term.echo(str,{flush: true});
	term.flush();
}

/* color the output in the terminal */
function colorText(txt,format,txtColor,highlighColor='black'){
    // format: 
    // - g (glow)
    // - b (bold)
    // - i (italic)
    // - u (underlined)
    
    return "[[" + format + ";" + txtColor + ";" + highlighColor + "]" + txt + "]";
}