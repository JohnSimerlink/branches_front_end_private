import {id, IHash, ITreeDataWithoutId} from '../interfaces';
import {pseudoRandomInt0To100, getSomewhatRandomId} from '../../testHelpers/randomValues';
import {MutableSubscribableStringSet} from '../set/MutableSubscribableStringSet';
import {MutableSubscribableField} from '../field/MutableSubscribableField';
import {SyncableMutableSubscribableTree} from './SyncableMutableSubscribableTree':

export const sampleTreeData1ContentId = '4324234';
export const sampleTreeData1ParentId = '4344324234';
export const sampleTreeData1Children = ['45344324234', 'aabc321', 'abcd43132'];
export const sampleTreeData1: ITreeDataWithoutId = {
    children: sampleTreeData1Children,
    contentId: sampleTreeData1ContentId,
    parentId: sampleTreeData1ParentId,
};

export function getASampleTreeGivenContentId(contentIdVal) {
    const parentIdVal = getSomewhatRandomId();

    const childrenVal: IHash<boolean> = {};
    let numChildren = Math.floor(Math.random() * 10);
    while (numChildren--) {
        childrenVal[getSomewhatRandomId()] = true;
    }
    const parentId = new MutableSubscribableField<id>({field: parentIdVal});
    const contentId = new MutableSubscribableField<id>({field: contentIdVal});
    const children = new MutableSubscribableStringSet({set: childrenVal});

    const tree = new SyncableMutableSubscribableTree({
        id: getSomewhatRandomId(),
        updatesCallbacks: [],
        parentId, contentId, children
    });

    return tree;
}
export function getASampleTree() {
    return getASampleTreeGivenContentId(getSomewhatRandomId());
}
