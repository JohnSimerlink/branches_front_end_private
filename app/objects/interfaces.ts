// tslint:disable no-empty-interface
import {CONTENT_TYPES} from './contentItem/ContentTypes';
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

interface IContentUser {
    overdue: IMutableField<boolean>
    timer: IMutableField<number>
    proficiency: IMutableField<PROFICIENCIES>
    lastRecordedStrength: IMutableField<number>
    // ^^ TODO: this might actually be an object not a simple number
}

interface ISubscribableContentUserCore extends IContentUser {
    overdue: ISubscribableMutableField<boolean>
    timer: ISubscribableMutableField<number>
    proficiency: ISubscribableMutableField<PROFICIENCIES>
    lastRecordedStrength: ISubscribableMutableField<number>
    val(): IContentUserData
}

interface IContentUserData {
    overdue: boolean,
    timer: number,
    proficiency: PROFICIENCIES,
    lastRecordedStrength: number,
}

enum ContentUserPropertyNames {
    OVERDUE,
    TIMER,
    PROFICIENCY,
    LAST_RECORDED_STRENGTH,
}

interface ISubscribableContentUser extends
ISubscribable<IValUpdates>, ISubscribableContentUserCore, IDescendantPublisher {}

interface IMutableSubscribableContentUser
    extends ISubscribableContentUser,
        IMutable<IProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames>> {}

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
interface IField<T> {
    val(): T;
}
interface IMutableField<T> extends IMutable<IDatedMutation<FieldMutationTypes>>, IField<T> {}

interface ISubscribableMutableField<T> extends ISubscribable<IDetailedUpdates>, IMutableField<T> {
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
type ContentUserPropertyMutationTypes = FieldMutationTypes
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

// stores

interface IMutableSubscribableGlobalStore
    extends ISubscribableGlobalStore, IMutable<IGlobalDatedMutation<AllObjectMutationTypes>> {
}

interface ISubscribableGlobalStore extends ISubscribable<ITypeAndIdAndValUpdates>,
    IDescendantPublisher {
}

interface ICoreSubscribableStore<UpdatesType, ObjectType> extends IDescendantPublisher {
    addAndSubscribeToItem(id: any, item: ISubscribable<UpdatesType> & ObjectType)
}
interface ISubscribableDataStore<UpdatesType, ObjectType>
    extends ISubscribable<IIdAndValUpdates>, ICoreSubscribableStore<UpdatesType, ObjectType> {
}

interface IMutableSubscribableTreeStore
    extends ISubscribableTreeStore, IMutable<IIdDatedMutation<TreeMutationTypes>> {
}

interface ISubscribableStore<SubscribableCoreInterface> extends ISubscribable<IIdAndValUpdates>,
        ICoreSubscribableStore<IIdAndValUpdates, SubscribableCoreInterface> {}

interface ISubscribableTreeStore
    extends ISubscribableStore<ISubscribableTreeCore> {}

type IValUpdates = any
interface IIdAndValUpdates {
    id: any,
    val: any
}
interface ITypeAndIdAndValUpdates extends IIdAndValUpdates {
    type: ObjectDataTypes
}
type ObjectDataDataTypes = ITreeDataWithoutId & ITreeUserData & IContentData & IContentUserData & ICoordinate

// subscribable
type updatesCallback<UpdateObjectType> = (updates: UpdateObjectType) => void;

interface ISubscribable<UpdateObjectType> {
    onUpdate(func: updatesCallback<UpdateObjectType>);
}

interface ISubscriber<UpdateObjectType> {
    subscribe(obj: ISubscribable<UpdateObjectType>)
}

interface IDescendantPublisher {
    startPublishing()
}

// tree
interface ITree {
    getId(): string;
    contentId: IMutableField<string>;
    parentId: IMutableField<string>;
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
    contentId: ISubscribableMutableField<string>
    parentId: ISubscribableMutableField<string>
    children: ISubscribableMutableStringSet
    val(): ITreeDataWithoutId
}

enum TreePropertyNames {
    CONTENT_ID,
    PARENT_ID,
    CHILDREN
}

interface ISubscribableTree extends ISubscribable<IValUpdates>, ISubscribableTreeCore, IDescendantPublisher { }

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

    // contentUser
    ContentUserPropertyNames,
    IContentUser,
    IContentUserData,
    IDetailedUpdates,
    IMutableSubscribableContentUser,
    ISubscribableContentUserCore,
    ISubscribableContentUser,
    ContentUserPropertyMutationTypes,

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

    // stores
    ISubscribableGlobalStore,
    ICoreSubscribableStore,
    IMutableSubscribableGlobalStore,
    IUndoableMutable,
    ISubscribableDataStore,
    IMutableSubscribableTreeStore,

    // subscribable
    updatesCallback,
    ISubscribable,
    ISubscriber,
    ISubscribableTreeStore,
    ISubscribableStore,

    // tree
    ITree,
    ITreeDataWithoutId,
    ITreeData,
    ISubscribableTreeCore,
    TreePropertyNames,
    ISubscribableTree,
    IMutableSubscribableTree,

    // treeUserData
    ITreeUserData,
}
