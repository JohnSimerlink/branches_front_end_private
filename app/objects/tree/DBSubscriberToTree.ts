// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import {
    IDatabaseAutoSaver, IDBSubscriberToTree, ISubscribableMutableField,
    ISubscribableMutableStringSet
} from '../interfaces';
import {IDBSubscriber} from '../interfaces';
import {TYPES} from '../types';

@injectable()
export class DBSubscriberToTree implements IDBSubscriberToTree {
    private contentId: ISubscribableMutableField<string>;
    private parentId: ISubscribableMutableField<string>;
    private children: ISubscribableMutableStringSet;
    private contentIdSyncer: IDatabaseAutoSaver;
    private parentIdSyncer: IDatabaseAutoSaver;
    private childrenSyncer: IDatabaseAutoSaver;

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
export class DBSubscriberToTreeArgs {
    @inject(TYPES.ISubscribableMutableString) public contentId
    @inject(TYPES.ISubscribableMutableString) public parentId
    @inject(TYPES.ISubscribableMutableStringSet) public children
    @inject(TYPES.IDatabaseAutoSaver) public contentIdSyncer: IDatabaseAutoSaver
    @inject(TYPES.IDatabaseAutoSaver) public parentIdSyncer: IDatabaseAutoSaver
    @inject(TYPES.IDatabaseAutoSaver) public childrenSyncer: IDatabaseAutoSaver
}
