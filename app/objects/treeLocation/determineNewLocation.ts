import {
	fXYField,
	ICoordinate
} from '../interfaces';
import {
	A_BIG_NUMBER,
	create2DArrayWith0s,
	determineObstacleVectorField,
	determinePreferenceField,
	getNeighboringNodesCoordinates
} from './determineNewLocationUtils';
// determineNewLocationAfterNewObstacle({preferenceField, coordinateField, obstacle})
// determineNewLocationAfterParentMove({
// until performance sucks, just recalculate the entire field every time
// for now preferenceField should be cleared before the function is called,
// and all 2DArrays should be created with correct dimensions
// const r = 25;
//TODO: this r is going to have to be dynamic based on the size of the node. . . or rather than calculating from the center of the node, we calcualte from the boundaries of the card

// have one radius which is preference radius, and another radius which is possibility radius
export function determineNewLocation(
	{parentCoordinate, obstacles, preferenceField, coordinateField, r}: {
		// squareSideSize: number
		parentCoordinate: ICoordinate
		obstacles: ICoordinate[],
		// preferredRadius: number,
		preferenceField: number[/*squareSideSize*/][/*squareSideSize*/] // square
		coordinateField: ICoordinate[/*squareSideSize*/][/*squareSideSize*/],
		r: number
	}): ICoordinate {
	// addPreferenceField
	const preferenceFieldFunction: fXYField = determinePreferenceField({
		parentCoordinate,
		r
	});
	const obstacleFields = obstacles.map(obstacle => determineObstacleVectorField({
		obstacleCoordinate: obstacle,
		r
	}));
	const fields = [preferenceFieldFunction, ...obstacleFields];
	for (const field of fields) {
		addFieldToPreferenceField({
			field,
			coordinateField,
			preferenceField
		});
	}

	const {row, column} = getBestLocation({preferenceField});
	const bestCoordinate = coordinateField[row][column];
	return bestCoordinate;
}

export function addFieldToPreferenceField({field, coordinateField, preferenceField}): void {
	for (let row = 0; row < preferenceField.length; row++) {
		for (let column = 0; column < preferenceField.length; column++) {
			const {x, y} = coordinateField[row][column];
			preferenceField[row][column] += field({
				x,
				y
			});
		}
	}
}

export function getBestLocation({preferenceField}: { preferenceField: number[][] }): { row: number, column: number } {
	let bestLocation = {
		row: 0,
		column: 0
	};
	let bestValue = -1 * A_BIG_NUMBER;
	let tempValue;
	for (let row = 0; row < preferenceField.length; row++) {
		for (let column = 0; column < preferenceField.length; column++) {
			tempValue = preferenceField[row][column];
			if (tempValue > bestValue) {
				bestLocation = {
					row,
					column
				};
				bestValue = tempValue;
				// tempValue = best
			}
		}
	}
	return bestLocation;
}

export function obtainNewCoordinate({r, sigmaInstance, parentCoordinate}): ICoordinate {
	const obstacles: ICoordinate[] =
		getNeighboringNodesCoordinates({
			nodes: sigmaInstance.graph.nodes(),
			r: 2 * r,
			point: parentCoordinate
		});

	const fieldWidth = 2 * r + 1;
	const preferenceField = create2DArrayWith0s(fieldWidth);
	/* need to get the parentX and Y and set those values equal to the 0+rth index.
	so [0, 0] is [parentY - r, parentX - r] and [0, 1] is [parentY - r, parentX - r + 1
	 . . . and [0, 2 * r] is [parentY - r, parentX - r + 2r]
	*
	*/
	const coordinateField = createCoordinateField({
		fieldWidth,
		centerCoordinate: parentCoordinate,
		r
	});
	const newLocation = determineNewLocation({
		parentCoordinate,
		obstacles,
		preferenceField,
		coordinateField,
		r
	});

	return newLocation;
}

/**
 *
 * @param {number} fieldWidth
 * @param {ICoordinate} centerCoordinate
 * @param {number} r
 * @returns {ICoordinate[][]}: A coordinate field.
 *  A 2-D array that contains {x, y} values of real coordinates on the sourceMap given inputs i and j.
 *  This is necessary if you have a coordinate field where when [j, i] = [0, 0], {x, y}
 *  doesn't necessarily equal {0, 0}. E.g. a coordinate field centered around [10, 10]
 *  A coordinate field with a center coordinate of {r, r} would always have {j, i} = {x, y}
 */
function createCoordinateField(
	{fieldWidth, centerCoordinate, r}:
		{ fieldWidth: number, centerCoordinate: ICoordinate, r: number }): ICoordinate[][] {
	const coordinateField = new Array(fieldWidth);
	for (let i = 0; i < fieldWidth; i++) {
		coordinateField[i] = new Array(fieldWidth);
		// const row = new Array(fieldWidth)
		for (let j = 0; j < fieldWidth; j++) {
			coordinateField[i][j] = {
				y: centerCoordinate.y - r + i,
				x: centerCoordinate.x - r + j,
			};
		}
	}
	return coordinateField;
}
