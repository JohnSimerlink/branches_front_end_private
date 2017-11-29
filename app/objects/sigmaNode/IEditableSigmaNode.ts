import {IContentData} from '../contentItem/IContentData';
import {IContentUserData} from '../contentUserData/IContentUserData';

interface IEditableSigmaNode {
    receiveNewContentData(contentData: IContentData)
    receiveNewContentUserData(contentData: IContentUserData)
    receiveTreeLocationData(contentData: IContentData)
    receiveTreeUserData(contentData: IContentData)
// TODO handle some of the receiveNewTreeData (parentId, children) in another class
}

export {IEditableSigmaNode}
