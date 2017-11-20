import {IMutableStringSet} from '../set/IMutableStringSet';
import {IId} from './IId';
import {IMutableId} from './MutableId';

interface IBasicTree {
    getId();
    contentId: IMutableId;
    parentId: IMutableId;
    children: IMutableStringSet;
}
export {IBasicTree}
