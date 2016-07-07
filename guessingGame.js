/* **** Global Variables **** */
// try to elminate these global variables in your project, these are here just to start.

var playersGuess,
	guesses = [],
    winningNumber = generateRandomNumber(1, 100);

/* **** Guessing Game Functions **** */

// Generate the Winning Number

function generateRandomNumber(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fetch the Players Guess

function playersGuessSubmission(){
	playersGuess = +document.getElementById('guess').value;
	document.getElementById('guess').value = "";
}

// Determine if the next guess should be a lower or higher number

function lowerOrHigher(){
	if (playersGuess > winningNumber) {
		return "Guess lower!";
	} else if (playersGuess < winningNumber) {
		return "Guess higher!";
	} else {
		return "You Won!";
	}
}

// Check if guess has been made before
function matchesPrevGuess() {
	for (var i = 0; i < guesses.length; i++) {
		if (playersGuess === guesses[i]) {return true;}
	}
	return false;
}

// change message in input field as feedback to player
function guessMessage(message) {
	$("#guess").attr("placeholder", message);
}

// update state/appearance of game when a guess is made
function stateUpdate(event) {
	function showWinningNumber() {
		$("#status").fadeOut(500);
		setTimeout(function() {
			$("#status").text("The answer was " + winningNumber);
		}, 500);
		$("#status").fadeIn(500);
	};

	var curClass = $("#circle").attr("class");
	if (event === "won") {
		guessMessage("You won!");
		showWinningNumber();
		$("#circle").switchClass(curClass, "won", 500);
		$("#submit-guess, #get-hint, #guess").prop("disabled", true);
	} else if (event === "lost") {
		guessMessage("You lost!");
		showWinningNumber();
		$("#circle").switchClass(curClass, "lost", 500);
		$("#submit-guess, #get-hint, #guess").prop("disabled", true);
	} else {
		var newClass = temperature().slice(0, temperature().length-2);
		if(newClass !== curClass) {$("#circle").switchClass(curClass, newClass);}
	}
}

// Check if the Player's Guess is the winning number 

function checkGuess(){
	if (isNaN(+playersGuess)) {
		guessMessage("numbers only!")
	} else if (playersGuess < 1 || playersGuess > 100) {
		guessMessage("range is 1-100!")
	} else if (playersGuess === winningNumber) {
		stateUpdate("won");
	} else if (matchesPrevGuess()) {
		guessMessage("already guessed that!");
			setTimeout(function(){
				guessMessage(temperature() + lowerOrHigher());
			},750); 
		stateUpdate();
	} else {
		guesses.push(playersGuess);
		$("#attempts").text(5 - guesses.length);
		if (+$("#attempts").text() <= 0) {
			stateUpdate("lost");
		} else {
			guessMessage(temperature() + lowerOrHigher());
			stateUpdate();
		}
	}
}


//temperature determines what message to give the player based on how far away 
function temperature() {
	if (Math.abs(winningNumber-playersGuess) <= 5) {
		return "HOT! ";
	} else if (Math.abs(winningNumber-playersGuess) <= 10) {
		return "WARM; ";
	} else if (Math.abs(winningNumber-playersGuess) <= 20) {
		return "COOL; ";
	} else {
		return "COLD; ";
	}
}

// Create a provide hint button that provides additional clues to the "Player"

function provideHint() {
	var hints=[];
	var numberOfHints = 10 - (guesses.length * 2);
	for (var i = 0; i < numberOfHints; i++) {
		var hintNumber = generateRandomNumber(1, 100);
		while (hints.indexOf(hintNumber) !== -1) {
			hintNumber = generateRandomNumber(1, 100)
		};
		hints[i] = hintNumber;
	};
	var winnerPosition = generateRandomNumber(1,numberOfHints);
	hints[winnerPosition] = winningNumber;
	$("#hints").text(hints.join(", "));
	$("#hint-popup").slideToggle();
}

// Allow the "Player" to Play Again

function playAgain() {
	// add code here
}

/* **** Event Listeners/Handlers ****  */

$(document).ready(function() {
	$('body').fadeIn(750);

	$('#submit-guess').click(function() {
		playersGuessSubmission();
		checkGuess();
	});

	$('#guess').keypress(function(key) {
		if (key.which === 13) {
			playersGuessSubmission();
			checkGuess();
		}
	})

	$('#get-hint').click(function() {
		$("#screen").addClass('screen');
		provideHint();
	});

	$('#close-hints').click(function() {
		$("#screen").removeClass('screen');
		$("#hint-popup").slideToggle();
	});	

	$('#restart').click(function() {
		$('body').fadeOut(750);
		setTimeout(function() {
			location.reload();
		}, 800);
	});
});