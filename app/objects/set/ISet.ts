export interface ISet<T> {
    getMembers(): T[],
    add(childId: T),
    remove(childId: T)
}
