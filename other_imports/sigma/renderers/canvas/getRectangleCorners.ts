export const CARD_HEIGHT_TO_NODE_SIZE_RATIO = 5
export const CARD_WIDTH_TO_NODE_SIZE_RATIO = 10
export function getRectangleCorners(centerX, centerY, size) {

	const halfWidth = calculateCardWidth(null, size) / 2;
	const halfHeight = calculateCardHeight(null, size) / 2
	const obj = {
		x1: centerX - halfWidth,
		y1: centerY - halfHeight,
		x2: centerX + halfWidth,
		y2: centerY + halfHeight,
		height: halfHeight * 2,
	}
	// console.log(obj, "centerX, centerY, size",centerX, centerY, size )
	return obj
}

export function calculateCardHeight(node, size, prefix = 'renderer1:') {
	size = node ? node[prefix + 'size'] : size;
	return size * CARD_HEIGHT_TO_NODE_SIZE_RATIO;
}

// TODO: start calling this differently such that, inside of the function we fetch the size from the renderer
export function calculateCardWidth(node, size, prefix = 'renderer1:') {
	size = node ? node[prefix + 'size'] : size;
	return size * CARD_WIDTH_TO_NODE_SIZE_RATIO;
}
