// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
    IDetailedUpdates, IHash,
    ISubscribable,
    ISyncableMutableSubscribableContent, IValable,
} from '../interfaces';
import {TYPES} from '../types'
import {MutableSubscribableContent} from './MutableSubscribableContent';

@injectable()
export class SyncableMutableSubscribableContent
    extends MutableSubscribableContent implements ISyncableMutableSubscribableContent {

    // TODO: should the below three objects be private?
    constructor(@inject(TYPES.SubscribableContentArgs) {updatesCallbacks, type, title, question, answer}) {
        super({updatesCallbacks, type, title, question, answer})
    }

    public getPropertiesToSync(): IHash<ISubscribable<IDetailedUpdates> & IValable> {
        return {
            type: this.type,
            question: this.question,
            answer: this.answer,
            title: this.title,
        }
    }
}
