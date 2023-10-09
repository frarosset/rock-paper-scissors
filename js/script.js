// This implementations works using integer choices (IDs).
// The corresponding textual description are stored in
// the global choices array.
// In particular, the integer assigned to a choice, is the
// index in the choices array, where the corresponding string
// is located. 
// This assumes that i+1 wins i (and 0 wins choices.length-1) 
// (see function roundOutcome)
// Global variables:
let choices = ['Rock','Paper','Scissors'];
let choicesLowerCase = choices.map(itm => itm.toLowerCase());
let uniqueInitials = choicesLowerCase.map(itm => itm[0]).filter((val, idx, arr)=>
  arr.indexOf(val) === idx).length === choicesLowerCase.length;


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
	let descrStr4 = '- If you leave the field empty, a random choice is generated.'

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

// Determine the ourcome of a round
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
  	 	return `It's a tie!`;
  	 	break;
  	 case 1:
	 	return `You Won! ${choices[playerSelection]} beats ${choices[computerSelection]}`;
  	 	break;
  	 case -1: 
  	 	return `You Lose! ${choices[computerSelection]} beats ${choices[playerSelection]}`;
  	 	break;
  	 default: 	
  	 	console.error('Invalid outcome');
  }
}

// Get user choice
// Output: user choice ID