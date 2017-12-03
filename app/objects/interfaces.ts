// tslint:disable no-empty-interface
import {CONTENT_TYPES} from './contentItem/ContentTypes';
import {ISubscribableTreeDataStore} from './dataStores/SubscribableTreeDataStore';
import {PROFICIENCIES} from './proficiency/proficiencyEnum';
import {UIColor} from './uiColor';

// app

interface IApp {
    start()
}

// contentItem

interface IContentData {
    type: CONTENT_TYPES;
    question?: string;
    answer?: string;
    title?: string;
}

// TODO: this is a really pathological interface. This should really be for IContentUserData or something
interface IContentItem {
    interactions,
    hasInteractions,
    lastRecordedStrength,
    overdue,
    isNew(),
}

// contentUserData

interface IContentUserData {
    overdue: boolean;
    timer: number;
    proficiency: PROFICIENCIES;
    lastRecordedStrength; // TODO: this might actually be an object not a simple number
}
interface IContentUser {
    overdue: ISubscribableMutableField
}

interface ISubscribableContentUserCore extends IContentUser {
    contentId: ISubscribableMutableField
    parentId: ISubscribableMutableField
    children: ISubscribableMutableStringSet
    val(): ITreeDataWithoutId
}



// dataStores

interface IMutableSubscribableGlobalDataStore
    extends ISubscribableGlobalDataStore, IMutable<IGlobalDatedMutation<AllObjectMutationTypes>> {
}
interface ISubscribableGlobalDataStoreCore {
    startBroadcasting()
}

interface ISubscribableGlobalDataStore extends ISubscribable<ITypeAndIdAndValUpdates>,
    ISubscribableGlobalDataStoreCore {
}

interface ICoreSubscribableDataStore<UpdatesType, ObjectType> {
    addAndSubscribeToItem(id: any, item: ISubscribable<UpdatesType> & ObjectType)
    subscribeToAllItems()
}
interface ISubscribableDataStore<UpdatesType, ObjectType>
    extends ISubscribable<IIdAndValUpdates>, ICoreSubscribableDataStore<UpdatesType, ObjectType> {
}

interface IMutableSubscribableTreeDataStore
    extends ISubscribableTreeDataStore, IMutable<IIdDatedMutation<TreeMutationTypes>> {
}

type IValUpdates = any
interface IIdAndValUpdates {
    id: any,
    val: any
}
interface ITypeAndIdAndValUpdates extends IIdAndValUpdates {
    type: ObjectDataTypes
}
type ObjectDataDataTypes = ITreeDataWithoutId & ITreeUserData & IContentData & IContentUserData & ICoordinate

// dbSync

interface IDatabaseSaver {
    save(updates: IDetailedUpdates)
}

interface IDatabaseSyncer extends ISubscriber<IDetailedUpdates> {
}

interface IDBSubscriber {
    subscribe()
}

interface IDetailedUpdates {
    updates?: object,
    pushes?: object
}

interface IFirebaseRef {
    update(updates: object),
    child(path: string): IPushable,
}

interface IPushable {
    push(item: any)
}

type ISaveUpdatesToDBFunction = (updates: IDetailedUpdates) => void

// field

enum FieldMutationTypes {
    SET
}
interface IField {
    val(): any;
}
interface IMutableField extends IMutable<IDatedMutation<FieldMutationTypes>>, IField {}

interface ISubscribableMutableField extends ISubscribable<IDetailedUpdates>, IMutableField {
}

// MathUtils

type radian = number // between 0 and 2 pi
type IPercentage = number // between 0 and 1

// mutations

interface IMutable<MutationInterface/*: IMutation*/> {
    addMutation(mutation: MutationInterface), // idempotent.
    mutations(): MutationInterface[],
    /* TODO: Arrays are evil for firebase / distributed data.
     might have to replace this with a set.
      - https://firebase.googleblog.com/2014/04/best-practices-arrays-in-firebase.html
      - https://firebase.googleblog.com/2014/05/handling-synchronized-arrays-with-real.html*/
}
interface IUndoableMutable<MutationInterface> extends IMutable<MutationInterface> {
    undo(mutationListIndex: number),
    redo(mutationListIndex: number)
}
interface IMutation<MutationTypes> {
    type: MutationTypes,
    data
}
interface IDatedMutation<MutationTypes> extends IMutation<MutationTypes> {
    timestamp: number // ISO 8601 POSIX Timestamp
}
interface IProppedDatedMutation<MutationTypes, PropertyNames> extends IDatedMutation<MutationTypes> {
    propertyName: PropertyNames
}
interface IIdDatedMutation<MutationTypes> extends IDatedMutation<MutationTypes> {
    id: string
}
interface IGlobalDatedMutation<MutationTypes> extends IIdDatedMutation<MutationTypes> {
    objectType: ObjectTypes
}
interface IActivatableMutation<MutationTypes> extends IMutation<MutationTypes> {
    active: boolean
}
interface IActivatableDatedMutation<MutationTypes>
    extends IDatedMutation<MutationTypes>, IActivatableMutation<MutationTypes> {
}

enum SetMutationTypes {
    ADD,
    REMOVE
}

enum PointMutationTypes {
    SHIFT
}

enum TreeMutationTypes {
    ADD_CHILD,
    REMOVE_CHILD
}

enum TreeParentMutationTypes {
    SET_ID
}

type TreePropertyMutationTypes = SetMutationTypes | FieldMutationTypes
type AllObjectMutationTypes =  PointMutationTypes | TreeMutationTypes | TreeParentMutationTypes

enum ObjectDataTypes {
    TREE_DATA,
    TREE_LOCATION_DATA,
    TREE_USER_DATA,
    CONTENT_DATA,
    CONTENT_USER_DATA,
}
enum ObjectTypes {
    TREE,
    TREE_LOCATION,
    TREE_USER,
    CONTENT,
    CONTENT_USER,
}

// point
interface ICoordinate {
    x: number,
    y: number
}

interface IPoint {
    val(): ICoordinate,
    // Points can have their coordinate shifted by another coordinate
}

// proficiencyStats

interface IProficiencyStats {
    UNKNOWN: number,
    ONE: number,
    TWO: number,
    THREE: number,
    FOUR: number,
}

// set

interface IMutableStringSet extends IMutable<IDatedMutation<SetMutationTypes>>, ISet<string> {
}

interface ISet<T> {
    val(): T[],
}

interface ISubscribableMutableStringSet extends ISubscribable<IDetailedUpdates>, IMutableStringSet {
}

// sigmaNode
type fGetSigmaIdsForContentId = (id: string) => string[]
interface ISigmaNodeHandler {
    handleUpdate(update: ITypeAndIdAndValUpdates)
}
interface ISigmaNodeHandlerSubscriber extends ISubscriber<ITypeAndIdAndValUpdates> { }

interface IColorSlice {
    color: UIColor
    start: radian
    end: radian
}

interface IEditableSigmaNode {
    receiveNewContentData(contentData: IContentData)
    receiveNewContentUserData(contentUserData: IContentUserData)
    receiveNewTreeLocationData(treeLocationData: ICoordinate)
    receiveNewTreeUserData(treeUserData: ITreeUserData)
    receiveNewTreeData(treeUserData: ITreeDataWithoutId)
// TODO handle some of the receiveNewTreeData (parentId, children) in another class
}

interface ISigmaNode extends ISigmaNodeData, IEditableSigmaNode {}

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

// subscribable
type updatesCallback<UpdateObjectType> = (updates: UpdateObjectType) => void;

interface ISubscribable<UpdateObjectType> {
    onUpdate(func: updatesCallback<UpdateObjectType>);
}

interface ISubscriber<UpdateObjectType> {
    subscribe(obj: ISubscribable<UpdateObjectType>)
}

// tree
interface ITree {
    getId(): string;
    contentId: IMutableField;
    parentId: IMutableField;
    children: IMutableStringSet;
}
interface ITreeDataWithoutId {
    contentId: string;
    parentId: string;
    children: string[];
}
interface ITreeData extends ITreeDataWithoutId {
    id: string;
}

interface ISubscribableTreeCore extends ITree {
    contentId: ISubscribableMutableField
    parentId: ISubscribableMutableField
    children: ISubscribableMutableStringSet
    val(): ITreeDataWithoutId
}

enum TreeMutationType {
    ADD_LEAF,
    REMOVE_LEAF,
}
enum TreePropertyNames {
    CONTENT_ID,
    PARENT_ID,
    CHILDREN
}

interface ISubscribableTree extends ISubscribable<IValUpdates>, ISubscribableTreeCore {}

interface IMutableSubscribableTree
    extends ISubscribableTree, IMutable<IProppedDatedMutation<TreePropertyMutationTypes, TreePropertyNames>> {}

// treeUserData

interface ITreeUserData {
    proficiencyStats: IProficiencyStats,
    aggregationTimer: number,
}

export {
    // app
    IApp,

    // contentItem
    IContentData,
    IContentItem,

    // contentUserData
    IContentUserData,
    IDetailedUpdates,

    // dataStore
    ISubscribableGlobalDataStoreCore,
    ISubscribableGlobalDataStore,
    ICoreSubscribableDataStore,
    IMutableSubscribableGlobalDataStore,
    IUndoableMutable,
    ISubscribableDataStore,
    IMutableSubscribableTreeDataStore,

    // dbSync
    IFirebaseRef,
    IPushable,
    IDatabaseSaver,
    IDatabaseSyncer,
    IDBSubscriber,
    ISaveUpdatesToDBFunction,

    // field
    FieldMutationTypes,
    IField,
    IMutableField,
    ISubscribableMutableField,

    // MathUtils
    radian,
    IPercentage,

    // mutations
    IMutation,
    IDatedMutation,
    IProppedDatedMutation,
    IActivatableMutation,
    IActivatableDatedMutation,
    IIdDatedMutation,
    IGlobalDatedMutation,
    ///
    ITypeAndIdAndValUpdates,
    IIdAndValUpdates,
    IMutable,
    ISigmaNodeHandlerSubscriber,
    IValUpdates,
    ObjectDataDataTypes,
    ///
    SetMutationTypes,
    PointMutationTypes,
    TreeMutationTypes,
    TreeParentMutationTypes,
    TreePropertyMutationTypes,
    AllObjectMutationTypes,

    ObjectDataTypes,
    ObjectTypes,

    // point
    ICoordinate,
    IPoint,

    // proficiencyStats
    IProficiencyStats,

    // sigmaNode
    fGetSigmaIdsForContentId,
    ISigmaNodeHandler,
    IColorSlice,
    ISigmaNodeData,

    // set
    IMutableStringSet,
    ISet,
    ISubscribableMutableStringSet,
    IEditableSigmaNode,
    ISigmaNode,

    // subscribable
    updatesCallback,
    ISubscribable,
    ISubscriber,

    // tree
    ITree,
    ITreeDataWithoutId,
    ITreeData,
    ISubscribableTreeCore,
    TreeMutationType,
    TreePropertyNames,
    ISubscribableTree,
    IMutableSubscribableTree,

    // treeUserData
    ITreeUserData,
}
