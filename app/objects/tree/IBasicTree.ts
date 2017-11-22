import {IMutableStringSet} from '../set/IMutableStringSet';
import {IId} from '../id/IId';
import {IMutableId} from '../id/MutableId';

interface IBasicTree {
    getId();
    contentId: IMutableId;
    parentId: IMutableId;
    children: IMutableStringSet;
}
export {IBasicTree}
