import {IMutableId} from '../id/IMutableId';
import {IMutableStringSet} from '../set/IMutableStringSet';

interface IBasicTree {
    getId(): string;
    contentId: IMutableId;
    parentId: IMutableId;
    children: IMutableStringSet;
}
export {IBasicTree}
