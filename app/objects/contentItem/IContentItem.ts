// TODO: this is a really pathological interface. This should really be for IContentUserData or something
export interface IContentItem {
    interactions,
    hasInteractions,
    lastRecordedStrength,
    overdue,
    isNew(),
}
