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

}

function Player() {

}

module.exports = {
    Ship,
    Gameboard,
    Player,
}
