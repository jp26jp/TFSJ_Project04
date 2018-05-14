// enums
const SYMBOL = Object.freeze({X: 0, O: 1});
const STATUS = Object.freeze({WINNER: 0, TIE: 1, CONTINUE: 2});

// html elements
let boxes              = document.querySelectorAll(".boxes .box");
const startGameButtons = document.querySelectorAll("a[href='#'].button");
const startContainer   = document.getElementById("start");
const finishContainer  = document.getElementById("finish");
const gameOverMessage  = document.getElementById("message");

// players
const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");

// tracker
let currentSymbol  = SYMBOL.O;
let gameStatus     = STATUS.CONTINUE;
let selectionsMade = 0;
let board          = [
	["", "", ""],
	["", "", ""],
	["", "", ""]
];

const addClass = (element, className) => element.className += ` ${className}`;
const removeClass = (element, className) => element.classList.remove(className);

function startGame() {
	clearBoard();
	activateListeners();
	startOTurn();
}

function startXTurn() {
	removeClass(player1, "active");
	addClass(player2, "active");
}

function startOTurn() {
	removeClass(player2, "active");
	addClass(player1, "active");
}

function clickX(event) {
	// if neither is true, then this slot is free
	if (!isSelected(event)) {
		board[findX(event)][findY(event)] = "X";
		event.target.className            = "box box-filled-2 selected";
		changeTurn();
	}
}

function clickO(event) {
	// if neither is true, then this slot is free
	if (!isSelected(event)) {
		board[findX(event)][findY(event)] = "Y";
		addClass(event.target, "box box-filled-1 selected");
		changeTurn();
	}
}

function showX(event) {
	if (!isSelected(event) && !event.target.classList.contains("box-filled-2")) {
		event.target.className += " box-filled-2";
	}
}

function showO(event) {
	if (!isSelected(event) && !event.target.classList.contains("box-filled-1")) {
		event.target.className += " box-filled-1";
	}
}

function hideX(event) {
	if (!isSelected(event)) {
		event.target.classList.remove("box-filled-2");
	}
}

function hideO(event) {
	if (!isSelected(event)) {
		event.target.classList.remove("box-filled-1");
	}
}

function isSelected(event) {
	return event.target.classList.contains("selected");
}

function findX(event) {
	const target  = event.target;
	const columns = Math.sqrt(boxes.length);
	let x         = 0;
	for (let i = 0; i < boxes.length; i++) {
		if (target === boxes[i]) {
			x = i % columns;
		}
	}

	return x;
}

function findY(event) {
	const target = event.target;
	const rows   = Math.sqrt(boxes.length);
	let y        = 0;
	for (let i = 0; i < boxes.length; i++) {
		if (target === boxes[i]) {
			y = Math.floor(i / rows);
		}
	}

	return y;
}

function changeTurn() {
	deactivateListeners();

	selectionsMade++;

	if (selectionsMade >= 5) {

		gameStatus = updateGameStatus();

		if (gameStatus === STATUS.WINNER || gameStatus === STATUS.TIE) {
			gameOver();
			return;
		}
	}

	if (currentSymbol === SYMBOL.O) {
		currentSymbol = SYMBOL.X;
		startXTurn();
	} else {
		currentSymbol = SYMBOL.O;
		startOTurn();
	}
	activateListeners();
}

function updateGameStatus() {

	// column
	for (let i = 0; i < board.length; i++) {
		for (let j = 0; j < board[i].length; j++) {
			if (board[0][i] !== "" && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
				return STATUS.WINNER;
			}
		}
	}

	// row
	for (let i = 0; i < board.length; i++) {
		for (let j = 0; j < board[i].length; j++) {
			if (board[i][0] !== "" && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
				return STATUS.WINNER;
			}
		}
	}

	if (board[0][0] !== "" && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
		return STATUS.WINNER;
	}

	if (board[0][2] !== "" && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
		return STATUS.WINNER;
	}

	if (selectionsMade === 9) {
		return STATUS.TIE;
	}

	return STATUS.CONTINUE;
}

function gameOver() {
	removeClass(finishContainer, "screen-win-two");
	removeClass(finishContainer, "screen-win-one");
	removeClass(finishContainer, "screen-win-tie");

	if (gameStatus === STATUS.TIE) {
		addClass(finishContainer, "screen-win-tie");
		gameOverMessage.textContent = "Tie";
	}

	else if (gameStatus === STATUS.WINNER) {
		gameOverMessage.textContent = "Winner";

		if (currentSymbol === SYMBOL.X) {
			finishContainer.className += " screen-win-two";
		}

		else if (currentSymbol === SYMBOL.O) {
			finishContainer.className += " screen-win-one";
		}
	}

	finishContainer.style.display = "block";
}

function clearBoard() {
	selectionsMade = 0;
	currentSymbol  = SYMBOL.O;

	for (let row = 0; row < board.length; row++) {
		for (let column = 0; column < board[row].length; column++) {
			board[row][column] = "";
		}
	}

	boxes.forEach((box) => box.className = "box");

	// hide the start screen and game over screen
	startContainer.style.display = finishContainer.style.display = "none";
}

// -- LISTENERS -- //

// start game
startGameButtons.forEach((button) => button.addEventListener("click", startGame));

function activateListeners() {
	for (let i = 0; i < boxes.length; i++) {
		if (currentSymbol === SYMBOL.O) {
			boxes[i].addEventListener("mouseover", showO);
			boxes[i].addEventListener("mouseout", hideO);
			boxes[i].addEventListener("click", clickO);
		} else {
			boxes[i].addEventListener("mouseover", showX);
			boxes[i].addEventListener("mouseout", hideX);
			boxes[i].addEventListener("click", clickX);
		}
	}
}

function deactivateListeners() {
	for (let i = 0; i < boxes.length; i++) {
		if (currentSymbol === SYMBOL.O) {
			boxes[i].removeEventListener("mouseover", showO);
			boxes[i].removeEventListener("mouseout", hideO);
			boxes[i].removeEventListener("click", clickO);
		} else {
			boxes[i].removeEventListener("mouseover", showX);
			boxes[i].removeEventListener("mouseout", hideX);
			boxes[i].removeEventListener("click", clickX);
		}
	}
}

