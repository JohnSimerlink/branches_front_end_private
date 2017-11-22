import {inject, injectable} from 'inversify';
import {IDatabaseSyncer} from '../dbSync/IDatabaseSyncer';
import {TYPES} from '../types';
import {BasicTree} from './BasicTree';
import {IBasicTree} from './IBasicTree';

@injectable()
class FirebaseSyncerBasicTree {
    @inject(TYPES.IDatabaseSyncer) private contentIdSyncer: IDatabaseSyncer;
    @inject(TYPES.IDatabaseSyncer) private parentIdSyncer: IDatabaseSyncer;
    @inject(TYPES.IDatabaseSyncer) private childrenSyncer: IDatabaseSyncer;
    private basicTree: IBasicTree;

    constructor(
        @inject(TYPES.IBasicTree) basicTree,
        @inject(TYPES.IDatabaseSyncer) contentIdSyncer: IDatabaseSyncer,
        @inject(TYPES.IDatabaseSyncer) parentIdSyncer: IDatabaseSyncer,
        @inject(TYPES.IDatabaseSyncer) childrenSyncer: IDatabaseSyncer,
    ) {
        this.basicTree = basicTree
        // this.contentIdSyncer.subscribe(this.basicTree.contentId)
        // this.parentIdSyncer.subscribe(parentId)
        // this.childrenSyncer.subscribe(this.basicTree.children)
    }
}
export {FirebaseSyncerBasicTree}
