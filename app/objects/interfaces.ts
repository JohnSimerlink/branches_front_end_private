// tslint:disable no-empty-interface
import {PROFICIENCIES} from './proficiency/proficiencyEnum';
import {UIColor} from './uiColor';

// app

interface IApp {
    start()
}

// contentItem

// TODO: this is a really pathological interface. This should really be for IContentUserData or something
interface IContentItem {
    interactions,
    hasInteractions,
    lastRecordedStrength,
    overdue,
    isNew(),
}

// content

enum CONTENT_TYPES {
    SKILL = 'skill',
    CATEGORY = 'heading', // heading, bc of backwards compatability
    FACT = 'fact',
}

interface IContent {
    type: IMutableField<CONTENT_TYPES>;
    question: IMutableField<string>;
    answer: IMutableField<string>;
    title: IMutableField<string>;
}

interface ISubscribableContentCore extends IContent {
    type: ISubscribableMutableField<CONTENT_TYPES>;
    question: ISubscribableMutableField<string>;
    answer: ISubscribableMutableField<string>;
    title: ISubscribableMutableField<string>;
    val(): IContentData
}

interface IContentData {
    type: CONTENT_TYPES;
    question?: string;
    answer?: string;
    title?: string;
}

enum ContentPropertyNames {
    TYPE,
    QUESTION,
    ANSWER,
    TITLE,
}

interface ISubscribableContent extends
    ISubscribable<IValUpdates>, ISubscribableContentCore, IDescendantPublisher {}

interface IMutableSubscribableContent
    extends ISubscribableContent,
        IMutable<IProppedDatedMutation<ContentPropertyMutationTypes, ContentPropertyNames>> {}

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
    SET,
    INCREMENT
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
interface IIdProppedDatedMutation<MutationTypes, PropertyNames>
    extends IIdDatedMutation<MutationTypes> {
    propertyName: PropertyNames
}
interface IIdDatedMutation<MutationTypes> extends IDatedMutation<MutationTypes> {
    id: string
}
interface IGlobalDatedMutation<MutationTypes> extends IIdProppedDatedMutation<MutationTypes, AllPropertyNames> {
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
    REMOVE_CHILD,
    CHANGE_PARENT,
    CHANGE_CONTENT
}

enum TreeParentMutationTypes {
    SET_ID
}

type TreePropertyMutationTypes = SetMutationTypes | FieldMutationTypes
type ContentUserPropertyMutationTypes = FieldMutationTypes
type ContentPropertyMutationTypes = FieldMutationTypes
type AllObjectMutationTypes =  PointMutationTypes | TreeMutationTypes | TreeParentMutationTypes
type AllPropertyMutationTypes = TreePropertyMutationTypes
    | ContentUserPropertyMutationTypes
    | ContentPropertyMutationTypes

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
    extends ISubscribableGlobalStore, IMutable<IGlobalDatedMutation<AllPropertyMutationTypes>> {
}

interface ISubscribableGlobalStore extends ISubscribable<ITypeAndIdAndValUpdates>,
    IDescendantPublisher {
}

interface ICoreSubscribableStore<UpdatesType, ObjectType> extends IDescendantPublisher {
    addAndSubscribeToItem(id: any, item: ISubscribable<UpdatesType> & ObjectType)
}

interface IMutableSubscribableTreeStore
    extends ISubscribableTreeStore,
        IMutable<IIdProppedDatedMutation<TreePropertyMutationTypes, TreePropertyNames>> {
}

interface IMutableSubscribableContentUserStore
    extends ISubscribableContentUserStore,
        IMutable<IIdProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames>> {
}

interface IMutableSubscribableContentStore
    extends ISubscribableContentStore,
        IMutable<IIdProppedDatedMutation<ContentPropertyMutationTypes, ContentPropertyNames>> {
}

interface ISubscribableStore<SubscribableCoreInterface> extends ISubscribable<IIdAndValUpdates>,
        ICoreSubscribableStore<IIdAndValUpdates, SubscribableCoreInterface> {}

interface ISubscribableTreeStore
    extends ISubscribableStore<ISubscribableTreeCore> {}

interface ISubscribableContentUserStore
    extends ISubscribableStore<ISubscribableContentUserCore> {}

interface ISubscribableContentStore
    extends ISubscribableStore<ISubscribableContentCore> {}

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

type AllPropertyNames = TreePropertyNames | ContentUserPropertyNames | ContentPropertyNames

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

// ui
interface IUI extends ISubscriber<ITypeAndIdAndValUpdates> {}

export {
    // app
    IApp,

    // contentItem
    IContentItem,

    // content
    CONTENT_TYPES,
    IContent,
    ISubscribableContentCore,
    IContentData,
    ContentPropertyNames,
    ISubscribableContent,
    IMutableSubscribableContent,
    ContentPropertyMutationTypes,

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
    IIdProppedDatedMutation,
    IGlobalDatedMutation,
    ///
    ITypeAndIdAndValUpdates,
    IIdAndValUpdates,
    IMutable,
    IValUpdates,
    ObjectDataDataTypes,
    ///
    SetMutationTypes,
    PointMutationTypes,
    TreeMutationTypes,
    TreeParentMutationTypes,
    TreePropertyMutationTypes,
    AllPropertyMutationTypes,

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
    ISubscribableStore,
    ISubscribableTreeStore,
    ISubscribableContentUserStore,
    ISubscribableContentStore,
    IMutableSubscribableTreeStore,
    IMutableSubscribableContentUserStore,
    IMutableSubscribableContentStore,

    // subscribable
    updatesCallback,
    ISubscribable,
    ISubscriber,
    IDescendantPublisher,

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

    // ui
    IUI,
}
