
import {IColorSlice} from './IColorSlice';

interface ISigmaNode {
    id: string;
    parentId: string;
    contentId: string;
    children: string[];
    x: number;
    y: number;
    aggregationTimer: number;
    content: object;
    label: string;
    size: number;
    colorSlices: IColorSlice[];
    overdue: boolean;
}

export {ISigmaNode}
