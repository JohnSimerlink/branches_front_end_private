import {ITreeDataFromDB, ITreeDataWithoutId, ITreeLocationData} from '../interfaces';

export function isValidTree(tree: ITreeDataFromDB) {
    return tree && tree.contentId && tree.contentId.val
    && tree.parentId && tree.parentId.val
    && (!tree.children || (tree.children && tree.children.val) || (tree.children && tree.children.mutations))
    // && tree.children instanceof Array
}
