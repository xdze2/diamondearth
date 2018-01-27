"use strict";

/**
 * Hierarchical subdivision of the spherical earth surface
 * in order to provide an universal addressing method
 *
 *
 * @module   diamondearth
 * @requires latlon-vectors
 *
 */

/**
 * Mesh system subdivising the Earth surface
 * @constructor
 */
function EarthMesh(){

}

/**
 * Creates a Diamond object
 * @param       {LatLon} N     North point
 * @param       {LatLon} E     Est point
 * @param       {LatLon} S     South point
 * @param       {LatLon} W     West point
 * @param       {int} level    zoom level it belongs to
 * @param       {string} name  name
 * @constructor
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
 * in clockwise order, starting from North
 *
 * @return {Array<Diamond>} Array of Diamond object
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
 * Returns an array of points [lat, lon]
 * along the Geodesic Lines of the Globe
 * in order to draw the Diamond on a map.
 *
 * @returns  {Array} [[Lat., Long.], ... ] coords
 */
Diamond.prototype.geodesicPoints = function() {
    let points = this.cardinalPoints

    let k = Math.max( 0, 8-this.level )   // number of refinement
    for (let i = 0; i<k; i++){
        points = refinePolygon(points)
    }

    points = points.map( x => [x.lat, x.lon] )

    /* Deals with the antimeridien crossing (-180°)
       if the polygon cross the anti-meridian
       TODO the actual test is not exactly true !!
       convert negative lon. to positve  cad +360
     */
    const max_lon = Math.max.apply(Math, points.map( x=>x[1]))
    const min_lon = Math.min.apply(Math, points.map( x=>x[1]))

    if( Math.sign(max_lon) != Math.sign(min_lon) &&
            (max_lon - min_lon) > 180 ){

        points = points.map( function(x){
            if( x[1]<0 ){
                return [ x[0], x[1]+360 ]
            } else {
                return x
            }
        })
    }

    return points
};

/**
 * Add a mid-point between every points,
 * on the geodesic lines
 *
 * @param  {Array<LatLon>} points A polygon
 * @return {Array<LatLon>}        A refined polygon
 */
function refinePolygon( points ){
    // add the mid point for every segment
    let refinedpoints = []
    for (let i = 0; i < points.length; i++) {
        let startpoint = points[i]
        let endpoint = points[ ((i+1 < points.length) ? i+1 : 0) ]

        let midpoint = startpoint.midpointTo( endpoint )
        refinedpoints.push( startpoint )
        refinedpoints.push( midpoint )
    }
    return refinedpoints
}


/**
 * Is the point inside in the Diamond ?
 * @param  {LatLon} point the point
 * @return {boolean}       true if inside
 */
Diamond.prototype.doInclude_old = function( point ){
    /* bug sur l'antimeridien... */
    return point.enclosedBy( this.cardinalPoints )
}
Diamond.prototype.doInclude = function( point ){
    let isinside = true

    const M = point.toVector()
    const points = [this.N, this.E, this.S, this.W, this.N]
                        .map( x => x.toVector() )

    for (let i = 0; i < points.length-1; i++) {
        const A = points[i]     // segment AB
        const B = points[ i+1 ]
        const n = A.cross( B ) // vector normal to OA, OB
        const p = n.dot( M ) // projection of M on n
        if( p < 0 ){
            isinside = false
            break
        }
    }

    return isinside
}


/**
 * Look for the Diamond which include the point
 * @param  {Array<Diamond>} diamondlist Array of Diamond to search
 * @param  {LatLon} point       the point
 * @return {Diamond}             the Diamond which include the point
 */
let whichOneInclude = function( diamondlist, point ){

    for (let i=0; i<diamondlist.length; i++){
        if( diamondlist[i].doInclude(point)  ){
            return diamondlist[i]
        }
    }
    console.log( 'debug: ', point )
    console.log('is not included in ')
    console.log( diamondlist )
}


/**
 * Dive through the succesive sub-Diamonds
 * which include the point
 *
 * @param  {LatLon} point            the point
 * @param  {Array<Diamond>} startingElements List of the starting Diamond
 * @param  {int} N               Number of level to descent
 * @return {Array<Diamond>}               The list of crossed Diamond
 */
let locate = function( point, startingElements, N ){
    let initialDiamond = whichOneInclude( startingElements, point  )
    let diamondlist = [initialDiamond, ]
    for (let i=0; i<N; i++){
        let nextDiamonds = diamondlist[i].subdivise()
        diamondlist.push( whichOneInclude( nextDiamonds, point ) )
    }
    return diamondlist
}


function buildTheAdress( diamondList ){
    let nameList = diamondList.map( x => x.name )
    let adress = nameList.join( '' )
    return adress
}

/**
 * Initial Volume - Octaedre
 * the Level 0 subdivision of the Globe
 *
 * @return {Array<Diamond>}
 */
 let build_octaedre = function (theta = 20){
    let N = new LatLon( +90, 0 ) // North pole
    let S = new LatLon( -90, 0 )

    let A = new LatLon( 0, theta ) // points on the equator
    let B = new LatLon( 0, theta + 90 )
    let C = new LatLon( 0, theta + 180 )
    let D = new LatLon( 0, theta - 90 )

    let octaedre = [
        new Diamond( N, B, S, A, 0, 'A' ),
        new Diamond( N, C, S, B, 0, 'B' ),
        new Diamond( N, D, S, C, 0, 'C' ),
        new Diamond( N, A, S, D, 0, 'D' )
    ]

    return octaedre
 }
let build_octaedre_old = function (){
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
/** TODO
 * Initial Volume - cube
 * the Level 0 subdivision of the Globe
 *
 * @return {Array<Diamond>}
 */
let build_cube = function (){
    return 1
}
