import {ITreeDataFromFirebase, ITreeDataWithoutId, ITreeLocationData} from '../interfaces';

function isValidTree(tree: ITreeDataFromFirebase) {
    return tree && tree.contentId && tree.contentId.val
    && tree.parentId && tree.parentId.val
    && (!tree.children || (tree.children && tree.children.val))
    // && tree.children instanceof Array
}
export {isValidTree}
