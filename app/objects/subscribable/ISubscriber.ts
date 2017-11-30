import {ISubscribable} from './ISubscribable';

export interface ISubscriber<UpdateObjectType> {
    subscribe(obj: ISubscribable<UpdateObjectType>)
}
