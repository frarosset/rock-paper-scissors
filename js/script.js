// This implementations works using integer choices (IDs).
// The corresponding textual description are stored in
// the global choices array.
// In particular, the integer assigned to a choice, is the
// index in the choices array, where the corresponding string
// is located. 
// This assumes that i+1 wins i (and 0 wins choices.length-1) 
// (see function roundOutcome)
let choices = ['Rock','Paper','Scissors']

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

