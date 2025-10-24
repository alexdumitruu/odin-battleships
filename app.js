function Ship() {
  function createShip(length, nrOfTimesHit = 0, sunk = false) {
    let ship = {
      length: length,
      nrOfTimesHit: nrOfTimesHit,
      sunk: sunk,

      isSunk: function () {
        if (this.nrOfTimesHit >= this.length) {
          this.sunk = true;
        }
      },

      hit: function () {
        if (this.sunk) return;
        this.nrOfTimesHit++;
        this.isSunk();
      },
    };
    return ship;
  }
  return { createShip };
}

function Gameboard() {
  function createGameboard() {
    const grid = Array.from({ length: 10 }, () => new Array(10).fill(null));
    console.log(grid);
    let gameboard = {
      gameboard: grid,
      placedShips: [],
      missedAttacks: [],
      sunkenShips: [],

      placeShip: function (ship, x, y, orientation) {
        let coordinates = [];
        if (orientation === "horizontal") {
          for (let i = 0; i < ship.length; i++) {
            coordinates.push([x + i, y]);
          }
        } else if (orientation === "vertical") {
          for (let i = 0; i < ship.length; i++) {
            coordinates.push([x, y + i]);
          }
        }

        for (const coord of coordinates) {
          const [x, y] = coord;

          if (x < 0 || x > 9 || y < 0 || y > 9) {
            return false;
          }
          if (this.gameboard[y][x] !== null) {
            return false;
          }
        }

        for (const coord of coordinates) {
          const [x, y] = coord;
          this.gameboard[y][x] = ship;
        }
        this.placedShips.push(ship);
        return true;
      },

      receiveAttack: function (x, y) {
        if (this.gameboard[y][x] !== null) {
          this.gameboard[y][x].hit();
          if (this.gameboard[y][x].sunk) {
            if (!this.sunkenShips.includes(this.gameboard[y][x])) {
              this.sunkenShips.push(this.gameboard[y][x]);
            }
          }
          this.gameboard[y][x] = "hit";
          return "hit";
        } else {
          this.missedAttacks.push([x, y]);
          this.gameboard[y][x] = "miss";
          return "miss";
        }
      },

      allShipsSunk: function () {
        return this.placedShips.length === this.sunkenShips.length;
      },
    };

    return gameboard;
  }

  return {
    createGameboard,
  };
}

Gameboard().createGameboard();

function Player() {}

module.exports = {
  Ship,
  Gameboard,
  Player,
};
