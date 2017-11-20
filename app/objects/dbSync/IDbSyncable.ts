import {ISubscriber} from '../ISubscriber';

export interface IDbSyncable extends ISubscriber {
    save(updates: object)
}
