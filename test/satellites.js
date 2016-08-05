var assert = require('chai').assert;
var Satellite = require('../satellite');
var Coordinate = require('../Coordinate');
var _ = require('lodash');

describe('Satellites', () => {
	describe('addConnectionTo', () => {
		const sat1 = new Satellite('SAT1', Coordinate.fromLatCoordinate(0,0,100));
		const sat2 = new Satellite('SAT2', Coordinate.fromLatCoordinate(0,0,150));

		sat1.addConnectionTo(sat2);

		it('both satellites should have added connections', () => {
			assert.equal(sat1._connections.includes(sat2), true);
			assert.equal(sat2._connections.includes(sat1), true);
			assert.equal(sat1.isConnectedTo(sat2), true);
			assert.equal(sat2.isConnectedTo(sat1), true);
		});

		const sat3 = new Satellite('Sat3', Coordinate.fromLatCoordinate(90,0,0));
		sat1.addConnectionTo(sat3);

		it ('satellites out of sight should not be added', () => {
			assert.equal(sat1.isConnectedTo(sat3), false);
		});
	});

	describe('isConnectedTo', () => {
		const sat1 = new Satellite('SAT1', Coordinate.fromLatCoordinate(0,0,100));
		const sat2 = new Satellite('SAT2', Coordinate.fromLatCoordinate(0,0,150));

		sat1._connections.push(sat2);

		it('should return true, if _connections includes an item', () => {
			assert.equal(sat1.isConnectedTo(sat2), true);
		}) ;
	});
});