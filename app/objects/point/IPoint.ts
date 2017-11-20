export interface ICoordinate {
    x: number,
    y: number
}

export interface IPoint {
    val(): ICoordinate,
    // Points can have their coordinate shifted by another coordinate
}
