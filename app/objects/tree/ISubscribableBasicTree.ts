import {ISubscribableMutableId} from '../id/ISubscribableMutableId';
import {ISubscribable} from '../subscribable/ISubscribable';
import {ISubscribableMutableStringSet} from '../set/ISubscribableMutableStringSet';
import {IBasicTree} from './IBasicTree';
import {IBasicTreeDataWithoutId} from './IBasicTreeData';

interface ISubscribableBasicTree extends IBasicTree {
    contentId: ISubscribableMutableId
    parentId: ISubscribableMutableId
    children: ISubscribableMutableStringSet
    val(): IBasicTreeDataWithoutId
}

export {ISubscribableBasicTree}
