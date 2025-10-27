import { Ship, Gameboard, Player } from './app.js';

//dom controller module

const domController = (() => {
  const playerBoardEl = document.getElementById("player-board");
  const computerBoardEl = document.getElementById("computer-board");
  const messageEl = document.getElementById("message-area");

  const renderBoard = (gameboard, isPlayerBoard) => {
    const boardElement = isPlayerBoard ? playerBoardEl : computerBoardEl;
    boardElement.innerHTML = "";

    const grid = gameboard.gameboard;
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.x = x;
        cell.dataset.y = y;

        const cellState = grid[y][x];

        if (cellState === "hit") {
          cell.classList.add("bg-hit");
        } else if (cellState === "miss") {
          cell.classList.add("bg-miss");
        } else if (isPlayerBoard && typeof cellState === "object") {
          cell.classList.add("bg-ship");
        } else {
          cell.classList.add("bg-water");
        }
        if (!isPlayerBoard && cellState !== "hit" && cellState !== "miss") {
          cell.classList.add("hover:bg-water-hover", "cursor-pointer");
          cell.addEventListener("click", gameController.handlePlayerAttack);
        }

        boardElement.appendChild(cell);
      }
    }
  };

  const updateMessage = (message) => {
    messageEl.textContent = message;
  };

  const toggleBoardActive = (isPlayerTurn) => {
    if (isPlayerTurn) {
      computerBoardEl.classList.remove("board-disabled");
    } else {
      computerBoardEl.classList.add("board-disabled");
    }
  };

  return { renderBoard, updateMessage, toggleBoardActive };
})();

//game controller module

const gameController = (() => {
  let player;
  let computer;
  let shipFactory;
  let isPlayerTurn;
  let isGameOver;
  const standardFleet = [5, 4, 3, 3, 2]; // Carrier, Battleship, Cruiser, Sub, Destroyer

  const newGameBtn = document.getElementById("new-game");
  const randomizeBtn = document.getElementById("randomize-ships");

  const init = () => {
    shipFactory = Ship();

    newGameBtn.addEventListener("click", startGame);
    randomizeBtn.addEventListener("click", () => {
      if (isGameOver) return;
      player.board = Gameboard().createGameboard();
      placeFleet(player, standardFleet);
      domController.renderBoard(player.board, true);
      domController.updateMessage("Ships randomized. Your turn!");
    });

    startGame();
  };

  const startGame = () => {
    player = Player().createPlayer("real");
    computer = Player().createPlayer("computer");
    isPlayerTurn = true;
    isGameOver = false;

    placeFleet(player, standardFleet);
    placeFleet(computer, standardFleet);

    domController.renderBoard(player.board, true);
    domController.renderBoard(computer.board, false);

    domController.updateMessage("New game started. Your turn!");
    domController.toggleBoardActive(true);
  };

  const placeFleet = (player, fleet) => {
    for (const length of fleet) {
      const ship = shipFactory.createShip(length);
      let placed = false;
      while (!placed) {
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
        placed = player.board.placeShip(ship, x, y, orientation);
      }
    }
  };

  const handlePlayerAttack = (e) => {
    if (isGameOver || !isPlayerTurn) return;

    const x = parseInt(e.target.dataset.x);
    const y = parseInt(e.target.dataset.y);

    computer.board.receiveAttack(x, y);
    domController.renderBoard(computer.board, false);

    // Check for win
    if (computer.board.allShipsSunk()) {
      endGame(true); // Player wins
      return;
    }

    // Switch to computer's turn
    isPlayerTurn = false;
    domController.updateMessage("Computer's turn...");
    domController.toggleBoardActive(false);

    // Add a small delay for the computer's turn
    setTimeout(computerTurn, 1200);
  };

  const computerTurn = () => {
    if (isGameOver) return;

    // Computer attacks player's board
    computer.computerAttack(player.board);
    domController.renderBoard(player.board, true); // Re-render player's board

    // Check for computer win
    if (player.board.allShipsSunk()) {
      endGame(false); // Computer wins
      return;
    }

    isPlayerTurn = true;
    domController.updateMessage("Your turn. Fire at will!");
    domController.toggleBoardActive(true);
  };

  const endGame = (playerWon) => {
    isGameOver = true;
    domController.toggleBoardActive(false);
    const message = playerWon
      ? "You win! Congratulations!"
      : "The computer wins. Better luck next time.";
    domController.updateMessage(message);
  };

  return { init, handlePlayerAttack };
})();

document.addEventListener("DOMContentLoaded", gameController.init);
