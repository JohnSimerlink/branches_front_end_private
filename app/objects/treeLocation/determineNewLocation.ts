import {fXYField, ICoordinate} from '../interfaces';
import {A_BIG_NUMBER, determineObstacleVectorField, determinePreferenceField} from './determineNewLocationUtils';

// determineNewLocationAfterNewObstacle({preferenceField, coordinateField, obstacle})
// determineNewLocationAfterParentMove({
// until performance sucks, just recalculate the entire field every time
// for now preferenceField should be cleared before the function is called,
// and all 2DArrays should be created with correct dimensions
const r = 10
export function determineNewLocation(
    {parentCoordinate, obstacles,  preferenceField, coordinateField}: {
    // squareSideSize: number
    parentCoordinate: ICoordinate
    obstacles: ICoordinate[],
    // preferredRadius: number,
    preferenceField: number[/*squareSideSize*/][/*squareSideSize*/] // square
    coordinateField: ICoordinate[/*squareSideSize*/][/*squareSideSize*/],
}): ICoordinate {
    // addPreferenceField
    const preferenceFieldFunction: fXYField = determinePreferenceField({parentCoordinate, r})
    const obstacleFields = obstacles.map(obstacle => determineObstacleVectorField({obstacleCoordinate: obstacle, r}))
    const fields = [preferenceFieldFunction, ...obstacleFields]
    for (const field of fields) {
        addFieldToPreferenceField({field, coordinateField, preferenceField})
    }

    const {row, column} = getBestLocation({preferenceField})
    const bestCoordinate = coordinateField[row][column]
    return bestCoordinate
}
export function addFieldToPreferenceField({field, coordinateField, preferenceField}): void {
    for (let row = 0; row < preferenceField.length; row++) {
        for (let column = 0; column < preferenceField.length; column++ ) {
            const {x, y} = coordinateField[row][column]
            preferenceField[row][column] += field({x, y})
        }
    }
}

export function getBestLocation({preferenceField}: {preferenceField: number[][]}): {row: number, column: number} {
    let bestLocation = {row: 0, column: 0}
    let bestValue = -1 * A_BIG_NUMBER
    let tempValue
    for (let row = 0; row < preferenceField.length; row++) {
        for (let column = 0; column < preferenceField.length; column++ ) {
            tempValue = preferenceField[row][column]
            if (tempValue > bestValue) {
                bestLocation = {row, column}
                bestValue = tempValue
                // tempValue = best
            }
        }
    }
    return bestLocation
}
