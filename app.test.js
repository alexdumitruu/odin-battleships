const { Ship, Gameboard, Player } = require("./app");

describe("Ship Factory", () => {
  test("should correctly create a ship, track hits, and sink", () => {
    const myShip = Ship().createShip(3);

    // use 'objectContaining' to verify only the data
    expect(myShip).toEqual(
      expect.objectContaining({
        length: 3,
        nrOfTimesHit: 0,
        sunk: false,
      })
    );

    myShip.hit();
    expect(myShip.nrOfTimesHit).toBe(1);

    myShip.hit();
    myShip.hit();

    expect(myShip.sunk).toBe(true);
  });
});

describe("Gameboard Factory", () => {
  let board;
  let shipFactory;

  beforeEach(() => {
    board = Gameboard().createGameboard();
    shipFactory = Ship();
  });

  describe("placeShip", () => {
    it("should place a ship horizontally", () => {
      const ship = shipFactory.createShip(3);
      board.placeShip(ship, 0, 0, "horizontal");
      expect(board.gameboard[0][0]).toBe(ship);
      expect(board.gameboard[0][1]).toBe(ship);
      expect(board.gameboard[0][2]).toBe(ship);
      expect(board.gameboard[0][3]).toBe(null);
    });

    it("should place a ship vertically", () => {
      const ship = shipFactory.createShip(3);
      board.placeShip(ship, 0, 0, "vertical");
      expect(board.gameboard[0][0]).toBe(ship);
      expect(board.gameboard[1][0]).toBe(ship);
      expect(board.gameboard[2][0]).toBe(ship);
      expect(board.gameboard[3][0]).toBe(null);
    });

    it("should not place a ship out of bounds", () => {
      const ship = shipFactory.createShip(4);
      expect(board.placeShip(ship, 8, 0, "horizontal")).toBe(false);
    });

    it("should not place a ship if overlapping", () => {
      const ship1 = shipFactory.createShip(3);
      const ship2 = shipFactory.createShip(3);
      board.placeShip(ship1, 0, 0, "horizontal");
      expect(board.placeShip(ship2, 1, 0, "vertical")).toBe(false);
    });
  });

  describe("receiveAttack", () => {
    it("should record missed attacks", () => {
      board.receiveAttack(0, 0);
      expect(board.missedAttacks).toContainEqual([0, 0]);
      expect(board.gameboard[0][0]).toBe("miss");
    });

    it("should register a hit on a ship", () => {
      const ship = shipFactory.createShip(3);
      board.placeShip(ship, 0, 0, "horizontal");
      board.receiveAttack(0, 0);
      expect(ship.nrOfTimesHit).toBe(1);
      expect(board.gameboard[0][0]).toBe("hit");
    });

    it("should not register multiple hits on the same spot", () => {
      const ship = shipFactory.createShip(3);
      board.placeShip(ship, 0, 0, "horizontal");
      board.receiveAttack(0, 0);
      board.receiveAttack(0, 0); 
      expect(ship.nrOfTimesHit).toBe(1);
    });
  });

  describe("allShipsSunk", () => {
    it("should report false if ships are still floating", () => {
      const ship = shipFactory.createShip(2);
      board.placeShip(ship, 0, 0, "horizontal");
      board.receiveAttack(0, 0);
      expect(ship.sunk).toBe(false);
      expect(board.allShipsSunk()).toBe(false);
    });

    it("should sink a ship and add it to sunkenShips list", () => {
      const ship = shipFactory.createShip(2);
      board.placeShip(ship, 0, 0, "horizontal");
      board.receiveAttack(0, 0);
      board.receiveAttack(1, 0);
      expect(ship.sunk).toBe(true);
      expect(board.sunkenShips).toContain(ship);
    });
    
    it("should not add a sunk ship to the list multiple times", () => {
        const ship = shipFactory.createShip(2);
        board.placeShip(ship, 0, 0, "horizontal");
        board.receiveAttack(0, 0);
        board.receiveAttack(1, 0); 
        board.receiveAttack(1, 0); 
        expect(ship.sunk).toBe(true);
        expect(board.sunkenShips.length).toBe(1);
    });

    it("should report true when all ships are sunk", () => {
      const ship1 = shipFactory.createShip(1);
      const ship2 = shipFactory.createShip(1);
      board.placeShip(ship1, 0, 0, "horizontal");
      board.placeShip(ship2, 2, 2, "horizontal");

      board.receiveAttack(0, 0); 
      expect(board.allShipsSunk()).toBe(false); 

      board.receiveAttack(2, 2); 
      expect(board.allShipsSunk()).toBe(true);
    });
  });
});

