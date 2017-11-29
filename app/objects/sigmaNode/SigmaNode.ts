// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import {TYPES} from '../types';
import {ISigmaNode} from './ISigmaNode';
import {CONTENT_TYPES} from '../contentItem/ContentTypes';
import {IContentData} from '../contentItem/IContentData';
import {IContentUserData} from '../contentUserData/IContentUserData';
import {IEditableSigmaNode} from './IEditableSigmaNode';
import {ICoordinate, IPoint} from '../point/IPoint';
import {ITreeUserData} from '../treeUserData/ITreeUserData';
import {ContentUserDataUtils} from '../contentUserData/ContentUserDataUtils';

@injectable()
class SigmaNode implements ISigmaNode, IEditableSigmaNode {
    public receiveTreeUserData(treeUserData: ITreeUserData) {
    }
    public receiveNewContentData(contentData: IContentData) {
    }

    public receiveNewContentUserData(contentData: IContentUserData) {
        this.overdue = contentData.overdue
        this.size = ContentUserDataUtils.getSizeFrom
        // eventually will affect size (size will be correlated to numDecibels)
    }

    public receiveTreeLocationData(treeLocationData: ICoordinate) {
        this.x = treeLocationData.x
        this.y = treeLocationData.y
    }
    /* TODO: this class shouldn't have a reference to sigma instance.
     But whatever class (SigmaNodesHandlers?) that has acccess to the instance
      of this class should call sigmaInstance.refresh() after an update is called on this class
      */

    public id: string;
    public parentId: string;
    public contentId: string;
    public children: string;
    public x: number;
    public y: number;
    public content: object;
    public label: string;
    public size: number;
    public color: string;
    public overdue: boolean;

    constructor(@inject(TYPES.SigmaNodeArgs)
                {
                    id,
                    parentId,
                    contentId,
                    children,
                    x,
                    y,
                    content,
                    label,
                    size,
                    color,
                    overdue
                }) {
        this.id = id
        this.parentId = parentId
        this.contentId = contentId
        this.children = children
        this.x = x
        this.y = y
        this.content = content
        this.label = label
        this.size = size
        this.color = color
        this.overdue = overdue
    }
}

@injectable()
class SigmaNodeArgs {
    @inject(TYPES.String) public id: string;
    @inject(TYPES.String) public parentId: string;
    @inject(TYPES.String) public contentId: string;
    @inject(TYPES.String) public children: string;
    @inject(TYPES.Number) public x: number;
    @inject(TYPES.Number) public y: number;
    @inject(TYPES.Object) public content: object;
    @inject(TYPES.String) public label: string;
    @inject(TYPES.Number) public size: number;
    @inject(TYPES.String) public color: string;
    @inject(TYPES.String) public overdue: boolean;
}

export {SigmaNode, SigmaNodeArgs}
