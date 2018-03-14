// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
    IDbValable,
    IDetailedUpdates, IHash,
    ISubscribable,
    ISyncableMutableSubscribableContent, IValable,
} from '../interfaces';
import {TYPES} from '../types';
import {MutableSubscribableContent} from './MutableSubscribableContent';

@injectable()
export class SyncableMutableSubscribableContent
    extends MutableSubscribableContent implements ISyncableMutableSubscribableContent {
    public getPropertiesToSync(): IHash<ISubscribable<IDetailedUpdates> & IDbValable> {
        return {
            type: this.type,
            question: this.question,
            answer: this.answer,
            title: this.title,
        };
    }
}
