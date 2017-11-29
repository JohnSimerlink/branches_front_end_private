import {IContentData} from '../contentItem/IContentData';
import {IContentUserData} from '../contentUserData/IContentUserData';
import {ICoordinate, IPoint} from '../point/IPoint';
import {IBasicTree} from '../tree/IBasicTree';
import {ITreeUserData} from '../treeUserData/ITreeUserData';

interface IEditableSigmaNode {
    receiveNewContentData(contentData: IContentData)
    receiveNewContentUserData(contentUserData: IContentUserData)
    receiveNewTreeLocationData(treeLocationData: ICoordinate)
    receiveNewTreeUserData(treeUserData: ITreeUserData)
    receiveNewTreeData(treeUserData: IBasicTree)
// TODO handle some of the receiveNewTreeData (parentId, children) in another class
}

export {IEditableSigmaNode}
