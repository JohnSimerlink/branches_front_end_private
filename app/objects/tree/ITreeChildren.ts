export interface ITreeChildren {
    getIds(): string[],
    add(childId: string),
    remove(childId: string)
}
