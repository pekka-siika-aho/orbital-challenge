const fs = require('fs'),
    _ = require('lodash'),
    Coordinate = require('./coordinate'),
    Satellite = require('./satellite'),
    http = require('http');

const earthRadius = require('./utils').earthRadius;
const satellites = [];
var routeStart;
var routeEnd;
var seed;

function readFile(filename) {
    processData(fs.readFileSync(filename, 'utf8'));
}

function readURL() {
    const req = http.get('http://space-fast-track.herokuapp.com/generate', (res) => {
        var data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            processData(data);
            buildConnections();
            console.log('Seed: ' + seed);
            console.log('Route: ' + routeFromCoords(routeStart, routeEnd));
        });
    });

    req.on('error', (e) => {
        console.log(e.message);
    });

    req.end();
}

function processData(input) {
    const lines = input.split('\n');

    for (var i = lines.length - 1; i >= 0; i--) {
        if (lines[i][0] != '#') {
            const data = lines[i].split(',');
            const coord = Coordinate.fromLatCoordinate(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
            if (data[0].startsWith('SAT')) satellites.push(new Satellite(data[0], coord));
            if (data[0] === 'ROUTE') {
                routeStart = Coordinate.fromLatCoordinate(data[1],data[2], 0);
                routeEnd = Coordinate.fromLatCoordinate(data[3], data[4], 0);
            }
        } else if (lines[i].startsWith('#SEED')) {
            seed = lines[i].split(' ')[1];
        }
    }
    // console.log(satellites);
}

function buildConnections() {
    for (var i = satellites.length - 1; i >= 0; i--) {
        for (var j = i; j >= 0; j--) {
            const sat1 = satellites[i];
            const sat2 = satellites[j];

            sat1.addConnectionTo(sat2);
        }
    }
}

function printSatellites() {
    for (var x = satellites.length - 1; x >= 0; x--) {
        console.log(satellites[x]);
    }
}

function init() {
    // readFile('data.csv');
    readURL();
    buildConnections();
}


function findClosestSat(coord) {
    return _.reduceRight(satellites, (flattened, other) => {
       return other.coord.distanceTo(coord) < flattened.coord.distanceTo(coord) ? other : flattened;
    });
}

function routeFromCoords(startCoord, endCoord) {
    const startSat = findClosestSat(startCoord);
    return route(startSat, endCoord, [startSat]);
}

function findSatellite(id) {
    return _.find(satellites, (sat) => { return sat.id === id; });
}

function route(startSat, endCoord, sats) {
    if (startSat.hasLineOfSightTo(endCoord)) {
        return sats;
    } else {
        const options = _.filter(startSat.getConnections(), (sat) => { return !_.includes(sats, sat); });
        if (options.length === 0) {
            console.log('Reached end of route. Route successful: ' + startSat.hasLineOfSightTo(endCoord));
            console.log('Last options: ' + startSat.getConnections());
            return sats;
        }

        const nextStep = deepSearch(options, endCoord, sats.slice(0));
        // const nextStep = closestToEnd(options, endCoord, sats);
        // console.log(nextStep);
        sats.push(nextStep);
        return route(nextStep, endCoord, sats);
    }
}

function closestToEnd(options, endCoord) {
    return _.reduceRight(options, (flattened, other) => {
            return flattened.coord.distanceTo(endCoord) < other.coord.distanceTo(endCoord) ? flattened : other;
    });
}

/*

Return satellite from options, that has closest distanse to endCoord at given depth

*/
function deepSearch(options, endCoord, checked = [], depth = 3) {

    if (depth > 0) {
        return _.reduceRight(options, (flattened, other) => {
            const flatClosest = deepSearch(flattened.getConnections(), endCoord, checked, depth - 1);
            const othClosest = deepSearch(other.getConnections(), endCoord, checked, depth -1);

            return flatClosest.coord.distanceTo(endCoord) < othClosest.coord.distanceTo(endCoord) ? flattened : other;
        });

    } else {
        const children = _.filter(options, (connection) => { return !_.includes(checked, connection); });
        // checked = _.union(checked, children);

        if (children.length > 0) {
            return closestToEnd(children, endCoord);
        } else {
            return closestToEnd(options, endCoord);
        }
    }
}

function reduceOptions(options, endCoord, checked, depth) {
    return _.map(options, (opt) => {

        const children = _.filter(opt.getConnections(), (connection) => { return !_.includes(checked, connection); });
        checked.push(opt);
         if (children.length === 0) {
            return [opt, opt.coord.distanceTo(endCoord)];
        } else {
            return [opt, closestToEnd(children, endCoord).coord.distanceTo(endCoord)];
        }
    });
}

function printRoute(routeStart, routeEnd) {
    var solution = routeFromCoords(routeStart, routeEnd);
    console.log(solution);
}

init();
// const solution = routeFromCoords(routeStart, routeEnd);
// console.log(solution);
// console.log(solution[solution.length - 1]);
// console.log(solution[solution.length - 1].hasLineOfSightTo(routeEnd));
// console.log(findClosestSat(routeEnd));
// console.log(findSatellite('SAT19'));
