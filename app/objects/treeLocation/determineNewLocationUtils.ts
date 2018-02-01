import {fXYField, ICoordinate} from '../interfaces';

export const A_BIG_NUMBER = 99999999999

export function determineObstacleVectorField(obstacleCoordinate: ICoordinate): fXYField {
    let vectorField: fXYField
    /* the closer the object is to the obstacle, the more negative a value the field should return.
     * As the object approaches infinite distance from the obstacle, the field should
      * return a negative value that is essentially zero.
     */
    function field({x, y}: ICoordinate): number {
        const d = distance({x1: obstacleCoordinate.x, y1: obstacleCoordinate.y, x2: x, y2: y})
        let howBadIsTheLocation: number
        if (d === 0) { // prevent div by 0 error
            howBadIsTheLocation = 1 * A_BIG_NUMBER
        } else {
            howBadIsTheLocation = 1 / d // farther away you are from obstacle, less bad of a location it is
        }
        return -1 * howBadIsTheLocation
    }
    vectorField = field
    return vectorField
}

const CIRCLE_PREFERENCE_FACTOR = 10

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
const r = 10
export function determinePreferenceField({parentCoordinate}: {parentCoordinate: ICoordinate}): fXYField {
    let vectorField: fXYField
    function field({x, y}: ICoordinate): number {
        const inside = !inCircle({center: {x: parentCoordinate.x, y: parentCoordinate.y}, r, x, y})
        const distanceFromCenter = distance({x1: parentCoordinate.x, y1: parentCoordinate.y, x2: x, y2: y})
        let howGoodIsTheLocation: number
        if (inside) {
            // more close to center the worse of an idea it is, so we should give the field a lower value

            const value = Math.E ** distanceFromCenter - 1
            /* if r <=1, this value might end up being negative,
            suggesting that this is a horrible place to put a node which would be right.
            We'd be trying to place a node less than one unit away from it's parent node
            */

        } else {
            const distanceFromCircle = distanceFromCenter - r
            howGoodIsTheLocation = CIRCLE_PREFERENCE_FACTOR / distanceFromCircle
            return howGoodIsTheLocation
        }

    }
    vectorField = field

    return vectorField
}
function inCircle({center, r, x, y}: {center: {x: number, y: number}, r: number, x: number, y: number}): boolean {
    const d = distance({x1: x, y1: y, x2: center.x, y2: center.y})
    return d < r
}

function distance({x1, y1, x2, y2}) {
    const deltaX = x2 - x1
    const deltaY = y2 - y1
    const discriminant = deltaX ** 2 + deltaY ** 2
    const d = Math.sqrt(discriminant)
    return d
}
