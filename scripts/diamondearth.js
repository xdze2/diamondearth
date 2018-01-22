




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
 function Diamond(N, E, S, W, level) {
    this.N = N
    this.E = E
    this.S = S
    this.W = W
    this.level = level
 }


 /**
  * Returns the four sub-diamond
  *
  * @returns {Array of Diamond object} Array of Diamonds, North, Est, South, West.
  *
  */
Diamond.prototype.subdivise = function() {
    let NE = this.N.midpointTo( this.E )
    let SE = this.S.midpointTo( this.E )
    let SW = this.S.midpointTo( this.W )
    let NW = this.N.midpointTo( this.W )
    let O  = this.E.midpointTo( this.W )

    let A = new Diamond( this.N, NE, O, NW, this.level+1 )
    let B = new Diamond( NE, this.E, SE, O, this.level+1 )
    let C = new Diamond( O, SE, this.S, SW, this.level+1 )
    let D = new Diamond( NW, O, SW, this.W, this.level+1 )

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

    k = 0   // number of refinement
    for (let i = 0; i<k; i++){
        points = refinePolygon(points)
    }
    return points.map( x => [x.lat, x.lon] )
};

/**
 * Subdivise the segments of a polygon along the geodesic line
 *
 * @param {Array of LatLon object}
 * @return {Array of LatLon object}
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
