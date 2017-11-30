import {ISubscribableMutableId} from '../id/ISubscribableMutableId';
import {ISubscribableMutableStringSet} from '../set/ISubscribableMutableStringSet';
import {IBasicTree} from './IBasicTree';
import {IBasicTreeDataWithoutId} from './IBasicTreeData';

interface ISubscribableBasicTreeCore extends IBasicTree {
    contentId: ISubscribableMutableId
    parentId: ISubscribableMutableId
    children: ISubscribableMutableStringSet
    val(): IBasicTreeDataWithoutId
}

export {ISubscribableBasicTreeCore}
