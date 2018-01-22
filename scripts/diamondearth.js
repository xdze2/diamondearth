




/**
 * Creates a Diamond object
 * from the North, Est, West and South points
 *
 * @constructor
 * @param {LatLon object} N - North point.
 * @param {LatLon object} E - Est point.
 * @param {LatLon object} S - South point.
 * @param {LatLon object} W - West point.

 *
 * @example
 *    let N = new LatLon(0, 20)
 *    let E = new LatLon(10, 0)
 *    let S = new LatLon(0, -20)
 *    let W = new LatLon(-10, 0)
 *
 *    let A = new Diamond( N, E, S, W )
 */
 function Diamond(N, E, S, W) {
    this.N = N;
    this.E = E;
    this.S = S;
    this.W = W;
 }


 /**
  * Returns the four sub-diamond
  *
  * @returns {Array of Diamond object} Array of Diamonds, North, Est, South, West.
  *
  */
Diamond.prototype.subdivise = function() {
    let NE = this.N.midpointTo(E)
    let SE = this.S.midpointTo(E)
    let SW = this.S.midpointTo(W)
    let NW = this.N.midpointTo(W)
    let O  = this.W.midpointTo(E)

    let A = new Diamond( N, NE, O, NW )
    let B = new Diamond( NE, E, SE, O )
    let C = new Diamond( O, SE, S, SW )
    let D = new Diamond( NW, O, SW, W )

    return [A, B, C, D]
}


/**
 * Converts the Diamond to an Array of coords LatLon
 * in order to be plot on a map
 *
 * TODO insert additional point to be on geodesic line
 *
 * @returns  {Array} Latitude/longitude point vector points to.
 *
 * @example
 *   var v = new Vector3d(0.500, 0.500, 0.707);
 *   var p = v.toLatLonS(); // 45.0°N, 45.0°E
 */
Diamond.prototype.points = function() {
    let points = [ this.N, this.E, this.S, this.W ]

    k = 4   // number of refinement
    for (let i = 0; i<k; i++){
        points = refinePolygon(points)
    }
    console.log(points)
    return points.map( x => [x.lat, x.lon] )
};

/**
 * Subdivise the segments of a polygon along the geodesic line
 *
 * @param {Array of LatLon object}
 *
 */
function refinePolygon( cardinalPoints ){
    // add the mid point for every segment
    let points = []
    for (let i = 0; i < cardinalPoints.length; i++) {
        startpoint = cardinalPoints[i]
        endpoint = cardinalPoints[ ((i+1 < cardinalPoints.length) ? i+1 : 0) ]

        let midpoint = startpoint.midpointTo( endpoint )
        points.push( startpoint )
        points.push( midpoint )
    }
    return points
}
