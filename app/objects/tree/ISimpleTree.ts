export interface ISimpleTree {
    getChildIds(): string[],
    addChild(childId: string),
    removeChild(childId: string)
}
