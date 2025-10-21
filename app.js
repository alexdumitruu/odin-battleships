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
  return { createShip, }
}

function Gameboard() {
    function createGameboard() {
        const gb = Array.from({ length: 10 }, () => new Array(10).fill(0));
        console.log(gameboard);
        let gameboard = {
            gameboard: gb,

            placeShip: function (startingRow, startingCol) {
                
            }
        }
        
        return gb;
    }

    return {
        createGameboard,
    }
}

Gameboard().createGameboard();

function Player() {

}

module.exports = {
    Ship,
    Gameboard,
    Player,
}
