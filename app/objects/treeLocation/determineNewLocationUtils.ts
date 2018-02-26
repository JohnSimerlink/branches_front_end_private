import {fXYField, ICoordinate} from '../interfaces';
import {log} from '../../core/log'

export const A_BIG_NUMBER = 99999999999
const OBSTACLE_AVOIDANCE_FACTOR = 5
const CIRCLE_PREFERENCE_FACTOR = 10

// shout out to archit
// he da man
export function determineObstacleVectorField({obstacleCoordinate, r}: {obstacleCoordinate: ICoordinate, r: number}): fXYField {
    let vectorField: fXYField
    /* the closer the object is to the obstacle, the more negative a value the field should return.
     * As the object approaches infinite distance from the obstacle, the field should
      * return a negative value that is essentially zero.
     */
    function field({x, y}: ICoordinate): number {
        const d = distance({x1: obstacleCoordinate.x, y1: obstacleCoordinate.y, x2: x, y2: y})
        // log('obstacleField called', {x, y}, d)
        let howBadIsTheLocation: number
        if (d >= r) {

            return 0 // field has no effect after a distance of r
        }
        if (d === 0) { // prevent div by 0 error
            // log('obstacleField called d is 0' )
            howBadIsTheLocation = 1 * A_BIG_NUMBER
        } else {
            // log('obstacleField called d is NOT 0', d )
            const percentEscapedFromField = d / r
            const percentInField = 1 - percentEscapedFromField
            howBadIsTheLocation = OBSTACLE_AVOIDANCE_FACTOR * percentInField
            // farther away you are from obstacle,
            // less bad of a location it is. but should be zero by the time you are r away
        }
        // log('obstacleField end', howBadIsTheLocation)
        return -1 * howBadIsTheLocation
    }
    vectorField = field
    return vectorField
}

/**
 * There is an ideal place that a child should be in terms of the parent location.
 * This ideal place exists along a circle with a certain radius centered around the parent node.
 * Too far outside of the circle is bad. That is too far away from the parent.
 * Inside the circle (especially near the center of the circle) is very bad.
 *  That is too close / cluttered with the parent.
 * @param {any} x
 * @param {any} y
 * @param {any} r
 * @returns {fXYField}
 */
export function determinePreferenceField({parentCoordinate, r}: {parentCoordinate: ICoordinate, r: number}): fXYField {
    let vectorField: fXYField
    function field({x, y}: ICoordinate): number {
        const inside = inCircle({center: {x: parentCoordinate.x, y: parentCoordinate.y}, r, x, y})
        const distanceFromCenter = distance({x1: parentCoordinate.x, y1: parentCoordinate.y, x2: x, y2: y})
        let howGoodIsTheLocation: number
        if (inside) {
            // more close to center the worse of an idea it is, so we should give the field a lower value
            const percentOfRadiusLength = distanceFromCenter / r
            howGoodIsTheLocation =  CIRCLE_PREFERENCE_FACTOR * percentOfRadiusLength
            // log('preferenceField ', {x, y}, distanceFromCenter, r, percentOfRadiusLength, howGoodIsTheLocation)

            // howGoodIsTheLocation = Math.E ** distanceFromCenter - 1
            /* this will make a distanceFromCenter of 0 give howGoodIsTheLocation
             a value of 0, because e^0 is 1, and 1 - 1 is 0. */
            /* if r <=1, this value might end up being negative,
            suggesting that this is a horrible place to put a node which would be right.
            We'd be trying to place a node less than one unit away from it's parent node
            */
            /** TODO: we also need to make something just inside the circle essentially
             * have the same value as something on the circle
             * . . . I think right now we have a non-continuous piecewise function
             * So we should on the circle be CIRCLE PREFERENCE FACTOR
             * Make center of the circle be 0. And the values drop linearly by r from
             */

        } else {
            // log('determineNewLocationUtils ,', {x, y, parentCoordinate, r}, ' NOT inside circle')
            const distanceFromCircle = distanceFromCenter - r
            if (distanceFromCircle === 0) {
                howGoodIsTheLocation = CIRCLE_PREFERENCE_FACTOR
            }
            const DECAY_SLOWDOWN_FACTOR = 20
            // needs to be like CIRCLE_PREFERENCE_FACTOR - epsilon when we are an infinitesimal away from the circle
            // when we are really far from the circle it needs to be 0
            // so CIRCLE_PREFERENCE_FACTOR * e^-x should do that for us
            howGoodIsTheLocation =
                CIRCLE_PREFERENCE_FACTOR * Math.E ** (-1 * distanceFromCircle / DECAY_SLOWDOWN_FACTOR)
        }
        return howGoodIsTheLocation
    }
    vectorField = field

    return vectorField
}
export function inCircle({center, r, x, y}: {center: {x: number, y: number}, r: number, x: number, y: number}): boolean {
    const d = distance({x1: x, y1: y, x2: center.x, y2: center.y})
    // log('the distance inside of inCircle is ', {center, r, x, y}, d)
    return d < r
}

// sometimes the arguments are fed strings . .
export function distance({x1, y1, x2, y2}: {x1: number, x2: number, y1: number, y2: number}) {
    // x1 = parseInt('' + x1)
    // x2 = parseInt('' + x2)
    // y1 = parseInt('' + y1)
    // y2 = parseInt('' + y2)
    const deltaX = x2 - x1
    const deltaY = y2 - y1
    const discriminant = deltaX ** 2 + deltaY ** 2
    const d = Math.sqrt(discriminant)
    // log('distance vals are ', x1, x2, y1, y2, deltaX, deltaY, discriminant, d)
    return d
}

// O(n), where n = num nodes. We could actually make this O(logn) maybe O(1)
export function getNeighboringNodesCoordinates(
    {nodes, r, point}: {nodes: ICoordinate[], r: number, point: ICoordinate}): ICoordinate[] {
    // log('getNeighboringNodesCoordinates called ', sigmaInstance, r, point)
    const neighboringNodesCoordinates: ICoordinate[] = []
    /* TODO: use some sort of hashmap or sorted metric 1d hilbert space for a
    more O(1) or O(log(n)) algorithm rather than O(n)
    */
    for (const node of nodes) {
        const d = distance(
            {x1: node.x, y1: node.y, x2: point.x, y2: point.y}
        )
        if (d < r) {
            neighboringNodesCoordinates.push({x: node.x, y: node.y})
        }
    }
    return neighboringNodesCoordinates

}

export function create2DArrayWith0s(width): number[][] {
    const matrix = new Array(width)
    for (let i = 0; i < width; i++) {
        matrix[i] = new Array(width)
        for (let j = 0; j < width; j++) {
            matrix[i][j] = 0
        }
    }
    return matrix
}

