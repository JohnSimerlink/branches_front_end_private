import {ITreeDataWithoutId} from '../interfaces';

export const sampleTreeData1ContentId = '4324234'
export const sampleTreeData1ParentId = '4344324234'
export const sampleTreeData1Children = ['45344324234', 'aabc321', 'abcd43132']
export const sampleTreeData1: ITreeDataWithoutId = {
    children: sampleTreeData1Children,
    contentId: sampleTreeData1ContentId,
    parentId: sampleTreeData1ParentId,
}
