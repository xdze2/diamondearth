




/**
 * Creates a Diamond object
 * from the North, Est, West and South points
 *
 * @constructor
 * @param {LatLon object} N - North point.
 * @param {LatLon object} E - Est point.
 * @param {LatLon object} S - South point.
 * @param {LatLon object} W - West point.

 */
 function Diamond(N, E, S, W, level, name) {
    this.N = N
    this.E = E
    this.S = S
    this.W = W
    this.level = level
    this.name = name

    this.cardinalPoints = [ this.N, this.E, this.S, this.W ]
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

    let A = new Diamond( this.N, NE, O, NW, this.level+1, 'N' )
    let B = new Diamond( NE, this.E, SE, O, this.level+1, 'E' )
    let C = new Diamond( O, SE, this.S, SW, this.level+1, 'S' )
    let D = new Diamond( NW, O, SW, this.W, this.level+1, 'W' )

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
    let points = this.cardinalPoints

    k = 8   // number of refinement
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


/* Is the point inside the Diamond ?
 *
 *  point is a LatLon object
*/
Diamond.prototype.doInclude = function( point ){
    return point.enclosedBy( this.cardinalPoints )
}

/*  Look for the Diamond in list which include the point

*/
let whichOneInclude = function( diamondlist, point ){

    for (let i=0; i<diamondlist.length; i++){
        if( diamondlist[i].doInclude(point)  ){
            return diamondlist[i]
        }
    }
    console.log('point not included in ')
    console.log( diamondlist )
}


/*  get through the Level to construct the adress
*/
let locate = function( point, startingElements, N ){
    initialDiamond = whichOneInclude( startingElements, point  )
    diamondlist = [initialDiamond, ]
    for (let i=0; i<N; i++){
        nextDiamonds = diamondlist[i].subdivise()
        diamondlist.push( whichOneInclude( nextDiamonds, point ) )
    }
    return diamondlist
}


/* Octaedre initial volume
    return a list of Diamond object for the level 0
*/
// Level 0
let build_octaedre = function (){
    let k = 0
    let thetaZero = +20   // arbitrary orientation angle for the octaedre
    let names = ['A', 'B', 'C', 'D']
    let octaedre = []
    for (let k=0; k<4; k++) {
        let N = new LatLon(90, thetaZero + 90*k)
        let E = new LatLon(0, thetaZero + 45 + 90*k)
        let S = new LatLon(-90, thetaZero + 90*k)
        let W = new LatLon(0, thetaZero - 45 + 90*k)

        let d = new Diamond( N, E, S, W, 0, names[k] )
        octaedre.push( d )
    }
    return octaedre
}
let build_cube = function (){
    let k = 0
    let thetaZero = +20   // arbitrary orientation angle for the octaedre
    let names = ['A', 'B', 'C', 'D']
    let octaedre = []
    for (let k=0; k<4; k++) {
        let N = new LatLon(90, thetaZero + 90*k)
        let E = new LatLon(0, thetaZero + 45 + 90*k)
        let S = new LatLon(-90, thetaZero + 90*k)
        let W = new LatLon(0, thetaZero - 45 + 90*k)

        let d = new Diamond( N, E, S, W, 0, names[k] )
        octaedre.push( d )
    }
    return octaedre
}
