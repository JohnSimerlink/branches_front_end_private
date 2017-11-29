// tslint:disable object-literal-sort-keys
interface IProficiencyStats {
    UNKNOWN: number,
    ONE: number,
    TWO: number,
    THREE: number,
    FOUR: number,
}
const defaultProficiencyStats = {
    UNKNOWN: 1,
    ONE: 0,
    TWO: 0,
    THREE: 0,
    FOUR: 0,
}
export {IProficiencyStats, defaultProficiencyStats}
