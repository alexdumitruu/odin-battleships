function Ship() {
  function createShip(length, nrOfTimesHit = 0, sunk = false) {
    let ship = {
      length: length,
      nrOfTimesHit: nrOfTimesHit,
      sunk: sunk,

      isSunk: function () {
        if (this.nrOfTimesHit >= this.length) {
          this.sunk = true;
        } else return;
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

      receiveAttack: function (x, y) {},
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
