import {ITreeDataWithoutId, ITreeLocationData} from '../interfaces';

function isValidTree(tree: ITreeDataWithoutId) {
    return tree && tree.contentId && tree.contentId.length > 0
    && tree.parentId && tree.parentId.length > 0
    // && tree.children instanceof Array
}
export {isValidTree}
