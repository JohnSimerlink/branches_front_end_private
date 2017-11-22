import {inject, injectable} from 'inversify';
import {IMutableStringSet} from '../set/IMutableStringSet';
import {TYPES} from '../types'
import {IBasicTree} from './IBasicTree';
import {IMutableId} from '../id/MutableId';

@injectable()
class BasicTree implements IBasicTree {
    // TODO: should the below three objects be private?
    public contentId: IMutableId;
    public parentId: IMutableId;
    public children: IMutableStringSet;
    public id: string;

    public getId() {
        return this.id
    }
    constructor(
        id,
        @inject(TYPES.IMutableId) contentId,
        @inject(TYPES.IMutableId) parentId,
        @inject(TYPES.IMutableStringSet) children
    ) {
        this.id = id
        this.contentId = this.contentId
        this.parentId = parentId
        this.children = children
    }
}

export {BasicTree}
