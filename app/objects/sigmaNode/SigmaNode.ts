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
import {IBasicTree} from '../tree/IBasicTree';
import {SigmaNodeUtils} from './SigmaNodeUtils';
import {IColorSlice} from './IColorSlice';

@injectable()
class SigmaNode implements ISigmaNode, IEditableSigmaNode {
    public receiveNewTreeData(tree: IBasicTree) {
        this.parentId = tree.parentId.val()
        this.contentId = tree.contentId.val()
        this.children = tree.children.val()
    }
    public receiveNewTreeUserData(treeUserData: ITreeUserData) {
        this.colorSlices = SigmaNodeUtils.getColorSlicesFromProficiencyStats(treeUserData.proficiencyStats)
    }
    public receiveNewContentData(contentData: IContentData) {
    }

    public receiveNewContentUserData(contentUserData: IContentUserData) {
        this.overdue = contentUserData.overdue
        this.size = ContentUserDataUtils.getSizeFromContentUserData(contentUserData)
        // eventually will affect size (size will be correlated to numDecibels)
    }

    public receiveNewTreeLocationData(treeLocationData: ICoordinate) {
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
    public children: string[];
    public x: number;
    public y: number;
    public content: IContentData;
    public label: string;
    public size: number;
    public colorSlices: IColorSlice[];
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
            colorSlices,
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
    @inject(TYPES.IColorSlice) public colorSlices: IColorSlice[];
    @inject(TYPES.String) public overdue: boolean;
}

export {SigmaNode, SigmaNodeArgs}
