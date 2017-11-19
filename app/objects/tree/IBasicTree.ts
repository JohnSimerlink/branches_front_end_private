import {IId} from './IId';
import {IMutableId} from './MutableId';

interface IBasicTree {
    getId();
    contentId: IMutableId;
    parentId: IMutableId;
    // children:
}
