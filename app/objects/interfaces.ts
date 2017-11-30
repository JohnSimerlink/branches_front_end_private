type IValUpdates = any
interface IIdAndValUpdates {
    id: any,
    val: any
}
interface ITypeAndIdAndValUpdates extends IIdAndValUpdates {
    type: any
}

export {
    ITypeAndIdAndValUpdates,
    IIdAndValUpdates,
    IValUpdates
}
