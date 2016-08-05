const _ = require('lodash');

class Satellite {
    constructor(id, coord) {
        this.id = id;
        this.coord = coord;
        this._connections = [];
    }

    toString() {
        return this.id;
        // return this.id + " " + this.coord;
    }

    hasLineOfSightTo(coord) {
    	return this.coord.hasLineOfSightTo(coord);
    }

    addConnectionTo(satellite) {
    	if (this.hasLineOfSightTo(satellite.coord) && satellite !== this) {
    		if (!this.isConnectedTo(satellite)) this._connections.push(satellite);
	    	if (!satellite.isConnectedTo(this)) satellite.addConnectionTo(this);
    	}
    }

    isConnectedTo(satellite) {
    	return _.includes(this._connections, satellite);
    }

    getConnections() {
        return this._connections.slice(0);
    }
}

module.exports = Satellite;