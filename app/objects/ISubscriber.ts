import {ISubscribable} from './ISubscribable';

export interface ISubscriber {
    subscribe(obj: ISubscribable)
}
