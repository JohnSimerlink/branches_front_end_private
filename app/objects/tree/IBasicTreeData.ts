interface IBasicTreeDataWithoutId {
    contentId: string;
    parentId: string;
    children: string[];
}
interface IBasicTreeData extends IBasicTreeDataWithoutId {
    id: string;
}
export {IBasicTreeData, IBasicTreeDataWithoutId}
