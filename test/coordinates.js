var assert = require('chai').assert;
var Coordinate = require('../coordinate');
var earthRadius = require('../utils').earthRadius;

describe('Coordinates', () => {
	describe('fromLatCoordinate', () => {
		it('should transform (0,0,0) to (6371,0,0)', () => {
			const coord = Coordinate.fromLatCoordinate(0,0,0);

			assert.equal(coord.x, 6371);
			assert.equal(coord.y, 0);
			assert.equal(coord.z, 0);
		});

		it('should transform (0,180,0) to (-6371,0,0)', () => {
			const coord = Coordinate.fromLatCoordinate(0,180,0);

			assert.equal(coord.x, -6371);
			assert.equal(coord.y, 0);
			assert.equal(coord.z, 0);
		});

		it('should transform (90,0,0) to (0,0,6371)', () => {
			const coord = Coordinate.fromLatCoordinate(90,0,0);

			assert.equal(coord.x, 0);
			assert.equal(coord.y, 0);
			assert.equal(coord.z, 6371);
		});

		it('given satellite point should be above earth', () => {
			const coord = Coordinate.fromLatCoordinate(85.25913724183744,10.161085445733619,402.35943372763296);
			assert.isAbove(coord.altitude(), 0);
		});

		it('satellite with given altitude should ', () => {
			assert.equal(Coordinate.fromLatCoordinate(0,0,10).altitude(), 10);
		});

	});

	describe('distanceTo', () => {
		it('should return distance', () => {
			const coord1 = new Coordinate(1,0,0);
			const coord2 = new Coordinate(0,0,0);

			assert.equal(coord1.distanceTo(coord2), 1);
		});
	});

	describe('isOnSameVerticalLineAs', () => {
		it('should work', () => {
			const coord1 = Coordinate.fromLatCoordinate(0,0,10);
			const coord2 = Coordinate.fromLatCoordinate(0,0,100);

			assert.equal(coord1.isOnSameVerticalLineAs(coord2), true);

			const coord3 = Coordinate.fromLatCoordinate(45,30,10);
			const coord4 = Coordinate.fromLatCoordinate(45,30,100);

			assert.equal(coord3.isOnSameVerticalLineAs(coord4), true);
		});

		it('given coordinates should be on same vertical line', () => {
			const coord1 = Coordinate.fromLatCoordinate(85.25913724183744, 10.161085445733619, 402.35943372763296);
			const coord2 = Coordinate.fromLatCoordinate(85.25913724183744, 10.161085445733619, 10);

			assert.equal(coord1.isOnSameVerticalLineAs(coord2), true);
		});
	});

	describe('altitude', () => {
		it('coord generated from altitude should have the same altitude as it was created with', () => {
			assert.equal(Coordinate.fromLatCoordinate(0,0,1).altitude(), 1);
			assert.equal(Coordinate.fromLatCoordinate(0,0,10).altitude(), 10);
			assert.equal(Coordinate.fromLatCoordinate(35,0,100).altitude(), 100);
			assert.equal(Coordinate.fromLatCoordinate(0,35,1000).altitude(), 1000);
			assert.equal(Coordinate.fromLatCoordinate(35,35,10000).altitude(), 10000);
		});
	});

	describe('hasLineOfSightTo', () => {
		it('should return true for itself', () => {
			const coord = Coordinate.fromLatCoordinate(0,0,30);

			assert.equal(coord.hasLineOfSightTo(coord), true);
		});

		it('should return true for coords on the same vertical line', () => {
			const coord1 = Coordinate.fromLatCoordinate(0,0,10);
			const coord2 = Coordinate.fromLatCoordinate(0,0,100);

			assert.equal(coord1.hasLineOfSightTo(coord2), true);

			const coord3 = Coordinate.fromLatCoordinate(45,30,10);
			const coord4 = Coordinate.fromLatCoordinate(45,30,100);

			assert.equal(coord3.hasLineOfSightTo(coord4), true);

		});

		it('should return true when coords differ on only tangential axis', () => {
			const coord1 = new Coordinate(7000, 0, 0);
			const coord2 = new Coordinate(7000, 7000, 0);

			assert.equal(coord1.hasLineOfSightTo(coord2), true);
		});

		it('should not return true for objects on the opposite side of earth', () => {
			const coord1 = Coordinate.fromLatCoordinate(0,0,30);
			const coord2 = Coordinate.fromLatCoordinate(90,90,30);

			assert.equal(coord1.hasLineOfSightTo(coord2), false);
		});

		it('given points should have line of sight', () => {
			// { x: '4647.0368', y: '1663.1004', z: '5040.8639' }
			// { x: '5452.5480', y: '1306.4790', z: '4110.0478' }
			// https://www.dropbox.com/s/f0ujv59fsxtgryc/Screenshot%202016-05-09%2020.01.02.png?dl=0

			const coord1 = new Coordinate(4647.0368, 1663.1004, 5040.8639);
			const coord2 = new Coordinate(5452.5480, 1306.4790, 4110.0478);

			assert.equal(coord1.hasLineOfSightTo(coord2), true);

		});

		it('should have LoS to point straight below it', () => {
			const coord1 = Coordinate.fromLatCoordinate(85.25913724183744, 10.161085445733619, 402.35943372763296);
			const coord2 = Coordinate.fromLatCoordinate(85.25913724183744, 10.161085445733619, 10);

			console.log(coord1.isOnSameVerticalLineAs(coord2));
			assert.equal(coord1.hasLineOfSightTo(coord2), true);
		});

		it('should have LoS to point on ground straight below it', () => {
			const coord1 = Coordinate.fromLatCoordinate(85.25913724183744, 10.161085445733619, 402.35943372763296);
			const coord2 = Coordinate.fromLatCoordinate(85.25913724183744, 10.161085445733619, 0);

			console.log(coord1.isOnSameVerticalLineAs(coord2));
			assert.equal(coord1.hasLineOfSightTo(coord2), true);
		});

		it('should have LoS to point on ground close to it', () => {
			const coord1 = Coordinate.fromLatCoordinate(85.25913724183744, 10.161085445733619, 402.35943372763296);
			const coord2 = Coordinate.fromLatCoordinate(85, 10, 0);

			assert.equal(coord1.hasLineOfSightTo(coord2), true);
		});
	});
});

