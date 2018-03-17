// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {injectable} from 'inversify';
import {IDbValable, IDetailedUpdates, IHash, ISubscribable, ISyncableMutableSubscribableContent,} from '../interfaces';
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
