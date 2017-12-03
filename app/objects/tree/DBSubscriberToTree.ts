// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import {IDatabaseSyncer, ISubscribableMutableField, ISubscribableMutableStringSet} from '../interfaces';
import {IDBSubscriber} from '../interfaces';
import {TYPES} from '../types';

@injectable()
class DBSubscriberToTree implements IDBSubscriber {
    private contentId: ISubscribableMutableField;
    private parentId: ISubscribableMutableField;
    private children: ISubscribableMutableStringSet;
    private contentIdSyncer: IDatabaseSyncer;
    private parentIdSyncer: IDatabaseSyncer;
    private childrenSyncer: IDatabaseSyncer;

    constructor(@inject(TYPES.DBSubscriberToTreeArgs) {
      contentId, parentId, children,
      contentIdSyncer, parentIdSyncer, childrenSyncer
    }) {
        this.contentId = contentId
        this.parentId = parentId
        this.children = children
        this.contentIdSyncer = contentIdSyncer
        this.parentIdSyncer = parentIdSyncer
        this.childrenSyncer = childrenSyncer
    }
    public subscribe() {
        // subscribe the database to any local changes in the objects
        this.contentIdSyncer.subscribe(this.contentId)
        this.parentIdSyncer.subscribe(this.parentId)
        this.childrenSyncer.subscribe(this.children)
        /* TODO: subscribe the objects to any changes in the database <<<
         OR TODO: do this in a different class. Remember the Single Responsibility Principle
         */
    }
}
@injectable()
class DBSubscriberToTreeArgs {
    @inject(TYPES.ISubscribableMutableId) public contentId
    @inject(TYPES.ISubscribableMutableId) public parentId
    @inject(TYPES.ISubscribableMutableStringSet) public children
    @inject(TYPES.IDatabaseSyncer) public contentIdSyncer: IDatabaseSyncer
    @inject(TYPES.IDatabaseSyncer) public parentIdSyncer: IDatabaseSyncer
    @inject(TYPES.IDatabaseSyncer) public childrenSyncer: IDatabaseSyncer
}
export {DBSubscriberToTree, DBSubscriberToTreeArgs}
