// enums
const SYMBOL = Object.freeze({X: 0, O: 1});

// html elements
const startGameButton      = document.getElementById("start-game");
const startScreenContainer = document.getElementById("start");

let boxes = document.querySelectorAll(".boxes .box");

// players
const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");

// turns
let currentSymbol = SYMBOL.O;

const addClass = (element, className) => element.className += ` ${className}`;

startGameButton.addEventListener("click", startGame);

function startGame() {
	// hide the welcome screen
	startScreenContainer.style.display = "none";
	activateListeners();
	startOTurn();
}

function startXTurn() {
	player1.classList.remove("active");
	addClass(player2, "active");
}

function startOTurn() {
	player2.classList.remove("active");
	addClass(player1, "active");
}

function setX(event) {
	// if neither is true, then this slot is free
	if (!isSelected(event)) {
		event.target.className += " box-filled-2 selected";
		changeTurn();
	}
}

function setO(event) {
	// if neither is true, then this slot is free
	if (!isSelected(event)) {
		event.target.className += " box-filled-1 selected";
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

function changeTurn() {
	deactivateListeners();
	if (currentSymbol === SYMBOL.O) {
		currentSymbol = SYMBOL.X;
		startXTurn();
	} else {
		currentSymbol = SYMBOL.O;
		startOTurn();
	}
	activateListeners();
}

function activateListeners() {
	for (let i = 0; i < boxes.length; i++) {
		if (currentSymbol === SYMBOL.O) {
			boxes[i].addEventListener("mouseover", showO);
			boxes[i].addEventListener("mouseout", hideO);
			boxes[i].addEventListener("click", setO);
		} else {
			boxes[i].addEventListener("mouseover", showX);
			boxes[i].addEventListener("mouseout", hideX);
			boxes[i].addEventListener("click", setX);
		}
	}
}

function deactivateListeners() {
	for (let i = 0; i < boxes.length; i++) {
		if (currentSymbol === SYMBOL.O) {
			boxes[i].removeEventListener("mouseover", showO);
			boxes[i].removeEventListener("mouseout", hideO);
			boxes[i].removeEventListener("click", setO);
		} else {
			boxes[i].removeEventListener("mouseover", showX);
			boxes[i].removeEventListener("mouseout", hideX);
			boxes[i].removeEventListener("click", setX);
		}
	}
}