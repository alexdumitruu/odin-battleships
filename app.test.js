const {
    Ship,
    Gameboard,
    Player,
} = require('./app');

describe('Ship Factory', () => {
    test('should correctly create a ship, track hits, and sink', () => {
        const myShip = Ship().createShip(3);

        // use 'objectContaining' to verify only the data
        expect(myShip).toEqual(expect.objectContaining({
            length: 3,
            nrOfTimesHit: 0,
            sunk: false
        }));

        myShip.hit();
        expect(myShip.nrOfTimesHit).toBe(1);

        myShip.hit();
        myShip.hit();
        
        expect(myShip.sunk).toBe(true);
    });
});