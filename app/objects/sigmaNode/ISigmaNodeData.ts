import {IContentUserData} from '../contentUserData/IContentUserData';
import {IProficiencyStats} from '../proficiencyStats/IProficiencyStats';
import {IColorSlice} from './IColorSlice';

interface ISigmaNodeData {
    id: string;
    parentId: string;
    contentId: string;
    children: string[];
    x: number;
    y: number;
    aggregationTimer: number;
    contentUserData: IContentUserData;
    content: object;
    label: string;
    size: number;
    colorSlices: IColorSlice[];
    proficiencyStats: IProficiencyStats;
    overdue: boolean;
}

export {ISigmaNodeData}
