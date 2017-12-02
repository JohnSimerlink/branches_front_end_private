// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import {IDatabaseSyncer} from '../interfaces';
import {IDBSubscriber} from '../interfaces';
import {TYPES} from '../types';
import {SubscribableBasicTree} from './SubscribableBasicTree';

@injectable()
class DBSubscriberToTree implements IDBSubscriber {
    private contentIdSyncer: IDatabaseSyncer;
    private parentIdSyncer: IDatabaseSyncer;
    private childrenSyncer: IDatabaseSyncer;
    private subscribableTree: SubscribableBasicTree;

    constructor(
        @inject(TYPES.ISubscribableBasicTree) subscribableTree,
        /* TODO: there's some inconsistency with having only 1 tree object, but 3 syncer objects */
        /* TODO: passing in the whole tree to just access an indeterminate number of variables is Stamp Coupling */
        @inject(TYPES.IDatabaseSyncer) contentIdSyncer: IDatabaseSyncer,
        @inject(TYPES.IDatabaseSyncer) parentIdSyncer: IDatabaseSyncer,
        @inject(TYPES.IDatabaseSyncer) childrenSyncer: IDatabaseSyncer,
    ) {
        this.subscribableTree = subscribableTree
        this.contentIdSyncer = contentIdSyncer
        this.parentIdSyncer = parentIdSyncer
        this.childrenSyncer = childrenSyncer
    }
    public subscribe() {
        // subscribe the database to any local changes in the objects
        this.contentIdSyncer.subscribe(this.subscribableTree.contentId)
        this.parentIdSyncer.subscribe(this.subscribableTree.parentId)
        this.childrenSyncer.subscribe(this.subscribableTree.children)
        /* TODO: subscribe the objects to any changes in the database <<<
         OR TODO: do this in a different class. Remember the Single Responsibility Principle
         */
    }
}
class FirebaseSyncableBasicTreeArgs {

}
export {DBSubscriberToTree}
