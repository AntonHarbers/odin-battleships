const gridSize = 10;
const shipNames = [
  "Carrier",
  "Battleship",
  "Cruiser",
  "Submarine",
  "Destroyer",
];
const shipLengths = [5, 4, 3, 2, 2];

const startGameButton = document.querySelector("#start-game-btn");
const menuScreen = document.querySelector("#menu-screen");
const gameScreen = document.querySelector("#game-screen");
const playerNameInput = document.querySelector("#player-name-input");
const playerNameStat = document.querySelector("#player-name-stat");

const playerGrid = document.querySelector('#player-grid');
const computerGrid = document.querySelector('#computer-grid');

const playerTurnDiv = document.getElementById('player-turn');
const computerTurnDiv = document.getElementById('computer-turn');

class Ship {
  constructor(name, length) {
    (this.name = name),
      (this.length = length),
      (this.hits = 0),
      (this.sunk = false);
  }

  hit() {
    this.hits++;
    this.isSunk();
  }

  isSunk() {
    if (this.hits == this.length) {
      this.sunk = true;
    }
  }
}

class Gameboard {
  constructor(isComputer, ownerPlayer) {
    this.owner = ownerPlayer;
    this.board = new Array();
    this.isComputer = isComputer;
    this.ships = [];
    this.sunkShips = [];
    this.hitAttacks = [];
    this.missedAttacks = [];
    this.initBoard();
    this.renderBoard();
  }

  initBoard() {
    for (var x = 0; x < gridSize; x++) {
      this.board[x] = [];
      for (var y = 0; y < gridSize; y++) {
        this.board[x][y] = "Empty";
      }
    }
  }

  renderBoard(){
    for(var x = 0; x < gridSize; x++){
      for(var y = 0; y < gridSize; y++){
        const newSquare = document.createElement('div');
        newSquare.id = `${x},${y}`;
        
        if(this.isComputer){
          newSquare.classList.add('computerSquare')
          newSquare.addEventListener('click', () => {
            squareEvent(newSquare, this.owner);
          })
        }else{
          newSquare.classList.add('playerSquare');
        }

        this.isComputer ? computerGrid.appendChild(newSquare) : playerGrid.appendChild(newSquare);
      }
    }
  }

  placeShip(name, length, x, y, isHorizontal) {
    for (var t = 0; t < length; t++) {
      if (
        this.board[isHorizontal ? x : x + t][isHorizontal ? y + t : y] !==
        "Empty"
      ) {
        return false;
      }
    }
    this.ships.push(new Ship(name, length));

    this.board[x][y] = this.ships[this.ships.length - 1];

    for (var i = 1; i < length; i++) {
      this.board[isHorizontal ? x : x + i][isHorizontal ? y + i : y] =
        this.ships[this.ships.length - 1];
    }

    return true;
  }

  receiveAttack(x, y) {
    let hasAlreadyHitPosition = false;
    this.hitAttacks.forEach((e) => {
      if (e[0] == x && e[1] == y) {
        hasAlreadyHitPosition = true;
      }
    });

    this.missedAttacks.forEach((e) => {
      console.log(e);
      if (e[0] == x && e[1] == y) {
        hasAlreadyHitPosition = true;
      }
    });

    if (hasAlreadyHitPosition) return false;

    if (this.board[x][y] !== "Empty") {
      console.log("hit");
      this.hitAttacks.push([x, y]);
      this.board[x][y].hit();
    } else {
      this.missedAttacks.push([x, y]);
    }

    return true;
  }

  allShipsSunk() {
    let allSunk = this.ships.length === 0 ? false : true;

    this.ships.forEach((ship) => {
      if (!ship.sunk) {
        console.log("issue");
        allSunk = false;
      }
    });

    return allSunk;
  }
}

class Player {
  constructor(name, isTurn, gameboard) {
    this.name = name;
    this.isTurn = isTurn;
    this.gameboard = gameboard;
    this.ships = [
      new Ship("Carrier", 5),
      new Ship("Battleship", 4),
      new Ship("Cruiser", 3),
      new Ship("Submarine", 2),
      new Ship("Destroyer", 2),
    ];
    this.activeShips = [];
    this.coordinatesAttacked = [];
  }

  makeRandomMove() {
    let attackWorked = false;

    while (!attackWorked) {
      const test = this.attackCoordinates(
        Math.floor(Math.random(0, gridSize)),
        Math.floor(Math.random(0, gridSize))
      );
      attackWorked = test;
    }

    return true;
  }

  attackCoordinates(x, y) {
    if (!this.isTurn) return false;
    let newCoordinates = true;

    this.coordinatesAttacked.forEach((coordinate) => {
      if (x === coordinate[0] && y === coordinate[1]) {
        newCoordinates = false;
      }
    });

    if (!newCoordinates) return false;

    this.coordinatesAttacked.push([x, y]);
    this.gameboard.receiveAttack(x, y);
    return true;
  }
}

let player1 = null;
let player2 = null;
let player1board = null;
let player2board = null;

startGameButton.addEventListener("click", () => {
  StartGame();
});

const StartGame = () => {
  if(playerNameInput.value == ""){
    alert("Please enter a name");
    return;
  }

  player1board = new Gameboard(false);
  player2board = new Gameboard(true);

  player1 = new Player(playerNameInput.value , true, player1board);
  playerNameStat.textContent = player1.name;
  player2 = new Player("Test2", false, player2board);

  player1board.owner = player1;
  player2board.owner = player2;
  
  menuScreen.style.display = "none";
  gameScreen.style.display = "flex";

  updateTurnUi();
};

const squareEvent = (square, owner) => {
  // check that player who is not owner is clicking
  console.log(square.id)
  console.log(owner.name)
  updateTurnUi();
}

const updateTurnUi = () => {

  if(player1.isTurn){
    playerTurnDiv.hidden = false;
    computerTurnDiv.hidden = true;
  }else{
    computerTurnDiv.hidden = true;
    playerTurnDiv.hidden = false;
  }
}

export { Ship, Gameboard, Player };
