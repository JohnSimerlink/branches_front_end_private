import {ISubscribableMutableId} from '../id/ISubscribableMutableId';
import {IBasicTree} from './IBasicTree';

interface ISubscribableBasicTree extends IBasicTree {
   contentId: ISubscribableMutableId
   parentId: ISubscribableMutableId
}

export {ISubscribableBasicTree}
