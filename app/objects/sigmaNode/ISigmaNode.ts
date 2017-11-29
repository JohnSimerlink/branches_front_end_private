
interface ISigmaNode {
    id: string;
    parentId: string;
    contentId: string;
    children: string[];
    x: number;
    y: number;
    content: object;
    label: string;
    size: number;
    colorSlices: IColorSlice[];
    overdue: boolean;
}

export {ISigmaNode}
