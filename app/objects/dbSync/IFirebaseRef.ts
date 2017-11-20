export interface IFirebaseRef {
    update(updates: object),
    child(path: string),
}
