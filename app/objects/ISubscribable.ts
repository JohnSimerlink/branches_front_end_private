import {IUpdates} from './dbSync/IUpdates';

export type updatesCallback = (updates: IUpdates) => void;

export interface ISubscribable {
    onUpdate(func: updatesCallback);
}
