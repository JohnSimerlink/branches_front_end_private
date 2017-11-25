import {inject, injectable} from 'inversify';
import {IMutableId} from '../id/MutableId';
import {IMutableStringSet} from '../set/IMutableStringSet';
import {TYPES} from '../types'
import {IBasicTree} from './IBasicTree';
import {ISubscribableMutableId} from '../id/ISubscribableMutableId';
import {ISubscribableMutableStringSet} from '../set/ISubscribableMutableStringSet';

@injectable()
class SubscribableBasicTree implements IBasicTree {
    // TODO: should the below three objects be private?
    public contentId: ISubscribableMutableId;
    public parentId: ISubscribableMutableId;
    public children: ISubscribableMutableStringSet;
    public id: string;

    public getId() {
        return this.id
    }
    constructor(
        @inject(TYPES.String) id,
        @inject(TYPES.IMutableId) contentId,
        @inject(TYPES.IMutableId) parentId,
        @inject(TYPES.IMutableStringSet) children
    ) {
        this.id = id
        this.contentId = contentId
        this.parentId = parentId
        this.children = children
    }
}

export {SubscribableBasicTree}
