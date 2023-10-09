// This implementations works using integer choices (IDs).
// The corresponding textual description are stored in
// the global choices array.
// In particular, the integer assigned to a choice, is the
// index in the choices array, where the corresponding string
// is located.  
let choices = ['Rock','Paper','Scissors']

// Create a random choice for the opponent (computer)
// This returns the ID of the choice
function getComputerChoice(){
	return Math.floor(Math.random() * choices.length);
}

