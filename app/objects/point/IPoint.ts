export interface ICoordinate {
    x: number,
    y: number
}

export interface IPoint {
    val(): ICoordinate,
    shift(delta: ICoordinate): ICoordinate
    // Points can have their coordinate shifted by another coordinate
}
