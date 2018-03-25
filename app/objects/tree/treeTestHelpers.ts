import {id, IHash, ITreeDataFromDB, ITreeDataWithoutId} from '../interfaces';
import {pseudoRandomInt0To100, getSomewhatRandomId} from '../../testHelpers/randomValues';
import {MutableSubscribableStringSet} from '../set/MutableSubscribableStringSet';
import {MutableSubscribableField} from '../field/MutableSubscribableField';
import {SyncableMutableSubscribableTree} from './SyncableMutableSubscribableTree';

export const sampleTreeData1ContentId = '4324234';
export const sampleTreeData1ParentId = '4344324234';
export const sampleTreeData1Child1 = '45344324234';
export const sampleTreeData1Child2 = 'aabc321';
export const sampleTreeData1Child3 = 'abcd43132';
export const sampleTreeData1Children = [sampleTreeData1Child1, sampleTreeData1Child2, sampleTreeData1Child3];
export const sampleTreeData1ChildrenSet = {
    [sampleTreeData1Child1]: true,
    [sampleTreeData1Child2]: true,
    [ sampleTreeData1Child3]: true,
}
export const sampleTree1ContentId = new MutableSubscribableField({field: sampleTreeData1ContentId})
export const sampleTree1ParentId = new MutableSubscribableField({field: sampleTreeData1ParentId})
export const sampleTree1Children = new MutableSubscribableStringSet({set: sampleTreeData1ChildrenSet})
export const sampleTreeData1: ITreeDataWithoutId = {
    children: sampleTreeData1Children,
    contentId: sampleTreeData1ContentId,
    parentId: sampleTreeData1ParentId,
};
export const sampleTreeData1ChildrenFromDB = {
   [sampleTreeData1Child1]: true,
   [sampleTreeData1Child2]: true,
   [sampleTreeData1Child3]: true,
}
export const sampleTreeData1FromDB: ITreeDataFromDB = {
    children: {
        val: sampleTreeData1ChildrenFromDB,
    },
    contentId: {
        val: sampleTreeData1ContentId,
    } ,
    parentId: {
        val: sampleTreeData1ParentId,
    },
};
export function getASampleTree1GivenTreeId({treeId}: {treeId: id}) {
    const childrenVal: IHash<boolean> = {};
    let numChildren = Math.floor(Math.random() * 10);
    while (numChildren--) {
        childrenVal[getSomewhatRandomId()] = true;
    }
    const parentId = new MutableSubscribableField<id>({field: sampleTreeData1ParentId});
    const contentId = new MutableSubscribableField<id>({field: sampleTreeData1ContentId});
    const children = new MutableSubscribableStringSet({set: sampleTreeData1ChildrenFromDB});

    const tree = new SyncableMutableSubscribableTree({
        id: treeId,
        updatesCallbacks: [],
        parentId, contentId, children
    });

    return tree;
}

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
