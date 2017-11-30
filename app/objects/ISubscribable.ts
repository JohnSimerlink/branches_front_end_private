import {IDetailedUpdates} from './dbSync/IDetailedUpdates';

export type updatesCallback<UpdateObjectType> = (updates: UpdateObjectType) => void;

export interface ISubscribable<UpdateObjectType> {
    onUpdate(func: updatesCallback<UpdateObjectType>);
}
