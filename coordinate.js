const earthRadius = require('./utils').earthRadius;
const Vector = require('./vector');

class Coordinate {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    hasLineOfSightTo(coord) {

        if (this.isOnSameVerticalLineAs(coord) && this.altitude() >= 0 && coord.altitude() >= 0) return true;

        // source: http://mathworld.wolfram.com/Point-LineDistance3-Dimensional.html
        const x1 = new Vector(this.x, this.y, this.z);
        const x2 = new Vector(coord.x, coord.y, coord.z);
        const x0 = new Vector(0,0,0);

        var d = x0.subtract(x1).cross(x0.subtract(x2)).length() / x2.subtract(x1).length();

        // line segment check, source: http://geomalgorithms.com/a02-_lines.html

        const v = x1.subtract(x2);
        const w = x0.subtract(x2);
        const origo = new Coordinate(0,0,0);

        if (w.dot(v) < 0 ) d = coord.distanceTo(origo);
        if (v.dot(v) <= 1) d = this.distanceTo(origo);

        d = d.toFixed(4);

        return d >= earthRadius;
    }

    toString() {
        return "(" + this.x + ", " + this.y + ", " + this.z + ")";
    }

    distanceTo(coord) {
        const dx = coord.x - this.x;
        const dy = coord.y - this.y;
        const dz = coord.z - this.z;

        return Math.sqrt(dx*dx + dy*dy + dz*dz);
    }

    altitude() {
        return (this.distanceTo(new Coordinate(0,0,0)) - earthRadius).toFixed(4);
    }

    isOnSameVerticalLineAs(coord) {
        const origo = new Coordinate(0,0,0);

        const furthest = this.distanceTo(origo) > coord.distanceTo(origo) ? this : coord;
        const closest = furthest === this ? coord : this;

        return (origo.distanceTo(closest) + closest.distanceTo(furthest)).toFixed(4) === origo.distanceTo(furthest).toFixed(4);
    }
}

Coordinate.fromLatCoordinate = function(lat, long, altitude) {
    const latRad = lat * Math.PI / 180;
    const longRad = long * Math.PI / 180;
    const r = altitude + earthRadius;

    // const xyPlanarR = r * Math.cos(latRad);

    // const z = r * Math.sin(latRad);
    // const y = xyPlanarR * Math.sin(longRad);
    // const x = Math.sqrt(Math.pow(xyPlanarR, 2) - Math.pow(y, 2));

    const x = (r * Math.cos(latRad) * Math.cos(longRad)).toFixed(4);
    const y = (r * Math.cos(latRad) * Math.sin(longRad)).toFixed(4);
    const z = (r * Math.sin(latRad)).toFixed(4);

    return new Coordinate(x, y, z);
};

module.exports = Coordinate;