// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import {ISubscribableMutableId} from '../id/ISubscribableMutableId';
import {IMutableId} from '../id/MutableId';
import {IMutableStringSet} from '../set/IMutableStringSet';
import {ISubscribableMutableStringSet} from '../set/ISubscribableMutableStringSet';
import {TYPES} from '../types'
import {IBasicTree} from './IBasicTree';

@injectable()
class SubscribableBasicTree implements IBasicTree {
    // TODO: should the below three objects be private?
    public contentId: ISubscribableMutableId;
    public parentId: ISubscribableMutableId;
    public children: ISubscribableMutableStringSet;
    private id: string;

    public getId() {
        return this.id
    }
    constructor(@inject(TYPES.SubscribableBasicTreeArgs) {id, contentId, parentId, children}) {
        this.id = id
        this.contentId = contentId
        this.parentId = parentId
        this.children = children
    }
}
@injectable()
class SubscribableBasicTreeArgs {
    @inject(TYPES.String) public id
    @inject(TYPES.IMutableId) public contentId
    @inject(TYPES.IMutableId) public parentId
    @inject(TYPES.IMutableStringSet) public children
}

export {SubscribableBasicTree, SubscribableBasicTreeArgs}
