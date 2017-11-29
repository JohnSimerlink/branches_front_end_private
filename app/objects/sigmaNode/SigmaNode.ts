// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import {TYPES} from '../types';
import {ISigmaNode} from './ISigmaNode';
import {CONTENT_TYPES} from '../contentItem/ContentTypes';
import {IContentData} from '../contentItem/IContentData';
import {IUserContentData} from '../contentUserData/IContentUserData';

@injectable()
class SigmaNode implements ISigmaNode {
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
    public receiveNewUserContentData(newUserContentData: IUserContentData) {
        // this.content = newContentData
        // this.label =
    }
    public receiveNewTreeLocationData(newUserContentData: IUserContentData) {
        // this.content = newContentData
        // this.label =
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
