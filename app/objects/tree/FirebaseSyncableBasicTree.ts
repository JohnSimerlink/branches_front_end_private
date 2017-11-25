import {inject, injectable} from 'inversify';
import {IDatabaseSyncer} from '../dbSync/IDatabaseSyncer';
import {TYPES} from '../types';
import {BasicTree} from './BasicTree';
import {IBasicTree} from './IBasicTree';
import {SubscribableBasicTree} from './SubscribableBasicTree';

@injectable()
class FirebaseSyncerBasicTree {
    private contentIdSyncer: IDatabaseSyncer;
    private parentIdSyncer: IDatabaseSyncer;
    private childrenSyncer: IDatabaseSyncer;
    private subscribableTree: SubscribableBasicTree;

    constructor(
        @inject(TYPES.ISubscribableBasicTree) subscribableTree, // TODO: passing in the whole tree is Stamp Coupling
        @inject(TYPES.IDatabaseSyncer) contentIdSyncer: IDatabaseSyncer,
        @inject(TYPES.IDatabaseSyncer) parentIdSyncer: IDatabaseSyncer,
        @inject(TYPES.IDatabaseSyncer) childrenSyncer: IDatabaseSyncer,
    ) {
        this.subscribableTree = subscribableTree
        this.contentIdSyncer = contentIdSyncer
        this.parentIdSyncer = parentIdSyncer
        this.childrenSyncer = childrenSyncer
        this.contentIdSyncer.subscribe(this.subscribableTree.contentId)
        this.parentIdSyncer.subscribe(this.subscribableTree.parentId)
        this.childrenSyncer.subscribe(this.subscribableTree.children)
    }
}
export {FirebaseSyncerBasicTree}
