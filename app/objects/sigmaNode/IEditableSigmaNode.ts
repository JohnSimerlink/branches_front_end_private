import {IContentData} from '../contentItem/IContentData';
import {IContentUserData} from '../contentUserData/IContentUserData';
import {ICoordinate, IPoint} from '../point/IPoint';
import {ITreeUserData} from '../treeUserData/ITreeUserData';

interface IEditableSigmaNode {
    receiveNewContentData(contentData: IContentData)
    receiveNewContentUserData(contentUserData: IContentUserData)
    receiveTreeLocationData(treeLocationData: ICoordinate)
    receiveTreeUserData(treeUserData: ITreeUserData)
// TODO handle some of the receiveNewTreeData (parentId, children) in another class
}

export {IEditableSigmaNode}
