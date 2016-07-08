$(document).ready(function() {
	$('body').fadeIn(750);

	// Start up with some important variables!
	var playersGuess,
		guesses = [],
	    winningNumber = generateRandomNumber(1, 100);


	/* **** Guessing Game Functions **** */

	// Generate random number in a range (will be used for winning number and providHint)
	function generateRandomNumber(min, max){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	// Fetch the Player's Guess
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

	// Change message (placeholder) in input field as feedback to player
	function guessMessage(message) {
		$("#guess").attr("placeholder", message);
	}

	// Update appearance (state) of game when a guess is made
	function stateUpdate(event) {
		// For showing winning number when a game ends
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
			$('#prev-guesses').text(guesses.join(", "))
			$("#attempts").text(5 - guesses.length);
			if (+$("#attempts").text() <= 0) {
				stateUpdate("lost");
			} else {
				guessMessage(temperature() + lowerOrHigher());
				stateUpdate();
			}
		}
	}


	// Determines what message to give the player based on how far away 
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

	// Opens a hidden element and provides hints, previous guesses, and key for temperatures
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
		if (hints.indexOf(winningNumber) === -1) {
			var winnerPosition = generateRandomNumber(1,numberOfHints);
			hints[winnerPosition] = winningNumber;
		}
		$("#hints").text(hints.join(", "));
		$("#hint-popup").slideToggle();
	}

	// Restart the game
	function restart() {
		$('body').fadeOut(750);
		setTimeout(function() {
			location.reload();
		}, 800);
	}


	/* **** Event Listeners/Handlers ****  */

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
		restart();
	});
});