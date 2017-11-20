export type updatesCallback = (updates: object) => void;

export interface ISubscribable {
    onUpdate(func: updatesCallback);
}
