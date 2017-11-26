import {IPushable} from './IPushable';

export interface IFirebaseRef {
    update(updates: object),
    child(path: string): IPushable,
}
