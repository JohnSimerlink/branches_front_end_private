export function getRectangleCorners(centerX, centerY, size) {

  const halfWidth = calculateCardWidth(null, size) / 2
  const halfHeight = calculateCardHeight(null, size) / 2
  const obj = {
    x1: centerX - halfWidth,
    y1: centerY - halfHeight,
    x2: centerX + halfWidth,
    y2: centerY + halfHeight,
    height: halfHeight * 2,
  }
  console.log(obj, "centerX, centerY, size",centerX, centerY, size )
  return obj
}

export function calculateCardHeight(node, size) {
    return size * 5;
}
export function calculateCardWidth(node, size) {
    return size * 10;
}
