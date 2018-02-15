// tslint:disable no-empty-interface
// tslint:disable no-namespace
import {PROFICIENCIES} from './proficiency/proficiencyEnum';
import {UIColor} from './uiColor';
import {SigmaNode, SigmaNodeArgs} from './sigmaNode/SigmaNode';
import {Store} from 'vuex';
// import {SigmaJs} from 'sigmajs';

// app

export interface IApp {
    start()
}
// components
export interface IVueComponentCreator {
    create()
}
export interface IKnawledgeMapCreator extends IVueComponentCreator {
}
export interface IKnawledgeMapCreatorClone extends IVueComponentCreator {
}
export interface ITree3Creator extends IVueComponentCreator {
}
export interface ITreeComponentCreator2 extends IVueComponentCreator {}
export interface IVuexStore extends Store<any> {
}
export interface ITree2ComponentCreator extends IVueComponentCreator {}

// contentItem

// TODO: this is a really pathological interface. This should really be for IContentUserData or something
export interface IContentItem {
    interactions,
    hasInteractions,
    lastRecordedStrength,
    overdue,
    isNew(),
}

// loaders
// export interface ITreeLoaderCore {
//     download(treeId): Promise<ITreeDataWithoutId>
//     deserializeFromDB(treeId, treeData: ITreeDataWithoutId): IMutableSubscribableTree
// }
export interface ISigmaNodeLoader {
    loadIfNotLoaded(sigmaid: id)
}
export interface ITreeLoader {
    getData(treeId: id): ITreeDataWithoutId
    getItem(treeId: id): ISyncableMutableSubscribableTree
    downloadData(treeId: id): Promise<ITreeDataWithoutId>
    isLoaded(treeId: id): boolean
}
// export interface ISpecialTreeLoader extends ITreeLoader {}
// export interface ITreeLocationLoaderCore {
//     download(treeId): Promise<ITreeLocationData>
//     deserializeFromDB(treeId, treeLocationData: ITreeLocationData): IMutableSubscribableTreeLocation
// }
export interface ITreeLocationLoader {
    getData(treeId: id): ITreeLocationData
    getItem(treeId: id): ISyncableMutableSubscribableTreeLocation
    downloadData(treeId: id): Promise<ITreeLocationData>
    isLoaded(treeId: id): boolean
}
export interface ITreeUserLoader {
    getData({treeId, userId}): ITreeUserData
    // getItem({treeId, userId}): ISyncableMutableSubscribableTreeUser
    downloadData({treeId, userId}): Promise<ITreeUserData>
    isLoaded({treeId, userId}): boolean
}

export interface IContentLoader {
    getData(contentId: id): IContentData
    getItem(contentId: id): ISyncableMutableSubscribableContent
    downloadData(contentId: id): Promise<IContentData>
    isLoaded(contentId: id): boolean
}

export interface IContentUserLoader {
    getData({contentId, userId}): IContentUserData
    getItem({contentUserId}): ISyncableMutableSubscribableContentUser
    downloadData({contentId, userId}): Promise<IContentUserData>
    isLoaded({contentId, userId}): boolean
}

export interface ISigmaNodeLoaderCore {
    load(sigmaId: id):
        Promise<ISigmaLoadData>
}
export interface ISigmaLoadData  {
    treeDataWithoutId: ITreeDataWithoutId,
    treeLocationData: ITreeLocationData,
    contentData: IContentData,
    contentUserData: IContentUserData
}
export interface IFamilyLoader {
    loadFamilyIfNotLoaded(sigmaId: id)
}
export interface IFamilyLoaderCore {
    loadFamily(sigmaId: id)
}

// content

export enum CONTENT_TYPES {
    SKILL = 'skill',
    CATEGORY = 'heading', // heading, bc of backwards compatability
    FACT = 'fact',
}

export interface IContent {
    type: IMutableField<CONTENT_TYPES>;
    question: IMutableField<string>;
    answer: IMutableField<string>;
    title: IMutableField<string>;
}

export interface ISubscribableContentCore extends IContent {
    type: ISubscribableMutableField<CONTENT_TYPES>;
    question: ISubscribableMutableField<string>;
    answer: ISubscribableMutableField<string>;
    title: ISubscribableMutableField<string>;
    val(): IContentData
}

export interface IContentDataFact {
    type: CONTENT_TYPES;
    question: string;
    answer: string;
    title?: string // << shouldn't exist
}
export interface IContentDataNotFact {
    type: CONTENT_TYPES;
    title: string;
    question?: string // <shouldn't exist
    answer?: string // <shouldn't exist
}
export type IContentDataEither = IContentDataFact | IContentDataNotFact
// export type IContentData = IContentDataFact & IContentDataNotFact
export interface IContentData {
    type: CONTENT_TYPES;
    question?: string;
    answer?: string;
    title?: string;
}
export interface IContentDataFromDB {
    type: {
        val: CONTENT_TYPES;
    },
    question?: {
        val: string
    },
    answer?: {
        val: string
    },
    title?: {
        val: string
    }
}

export enum ContentPropertyNames {
    TYPE = 'TYPE',
    QUESTION = 'QUESTION',
    ANSWER = 'ANSWER',
    TITLE = 'TITLE',
}

export interface ISubscribableContent extends
    ISubscribable<IValUpdates>, ISubscribableContentCore, IDescendantPublisher {}

export interface IMutableSubscribableContent
    extends ISubscribableContent,
        IMutable<IProppedDatedMutation<ContentPropertyMutationTypes, ContentPropertyNames>> {}

// contentUser

export interface IContentUser {
    overdue: IMutableField<boolean>
    timer: IMutableField<number>
    proficiency: IMutableField<PROFICIENCIES>
    lastRecordedStrength: IMutableField<number>
    // ^^ TODO: this might actually be an object not a simple number
}

export interface ISubscribableContentUserCore extends IContentUser {
    overdue: ISubscribableMutableField<boolean>
    timer: ISubscribableMutableField<number>
    proficiency: ISubscribableMutableField<PROFICIENCIES>
    lastRecordedStrength: ISubscribableMutableField<number>
    val(): IContentUserData
}

export enum ContentUserPropertyNames {
    OVERDUE = 'VERDUE',
    TIMER = 'TIMER',
    PROFICIENCY = 'PROFICIENCY',
    LAST_RECORDED_STRENGTH = 'LAST_RECORDED_STRENGTH',
}

export interface ISubscribableContentUser extends
    ISubscribable<IValUpdates>, ISubscribableContentUserCore, IDescendantPublisher {}

export interface IMutableSubscribableContentUser
    extends ISubscribableContentUser,
        IMutable<IProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames>> {}

export interface ISyncableMutableSubscribableContentUser extends IMutableSubscribableContentUser, ISyncable {
    getPropertiesToSync(): IHash<ISubscribable<IDetailedUpdates> & IValable>
}

export interface ISyncableMutableSubscribableContent extends IMutableSubscribableContent, ISyncable {
    getPropertiesToSync(): IHash<ISubscribable<IDetailedUpdates> & IValable>
}
export interface ISyncableMutableSubscribableTree extends IMutableSubscribableTree, ISyncable {
    getPropertiesToSync(): IHash<ISubscribable<IDetailedUpdates> & IValable>
}
export interface ISyncableMutableSubscribableTreeLocation extends IMutableSubscribableTreeLocation, ISyncable {
    getPropertiesToSync(): IHash<ISubscribable<IDetailedUpdates> & IValable>
}

export interface ISyncableMutableSubscribableTreeUser extends
    IMutableSubscribableTreeUser, ISyncable {
    getPropertiesToSync(): IHash<ISubscribable<IDetailedUpdates> & IValable>
}

export interface IContentUserData {
    id: string,
    overdue: boolean,
    timer: number,
    proficiency: PROFICIENCIES,
    lastRecordedStrength: number,
}

export interface IContentUserDataFromDB {
    id: string,
    overdue: {
        val: boolean,
    },
    timer: {
        val: number,
    },
    proficiency: {
        val: PROFICIENCIES
    },
    lastRecordedStrength: {
        val: number
    }
}

// dbSync

export interface IObjectFirebaseAutoSaver {
    initialSave()
    start()
}
export interface IDatabaseSaver {
    save(updates: IDetailedUpdates)
}

export type ISaveUpdatesToDBFunction = (updates: IDetailedUpdates) => void

export interface IDatabaseAutoSaver extends ISubscriber<IDetailedUpdates> {
}

export interface IDBSubscriber {
    subscribe()
}
export interface IDBSubscriberToTreeLocation extends IDBSubscriber {}
export interface IDBSubscriberToTree extends IDBSubscriber {}

export interface IDetailedUpdates {
    updates?: object,
    pushes?: object
}

export interface ISyncable {
    getPropertiesToSync(): IHash<ISubscribable<IDetailedUpdates> & IValable>
}
export interface ISyncableValable extends IValable, ISyncable {
}
export interface ISnapshot {
    val(): any
}

export interface IPushable {
    push(item: any)
}

// field

export enum FieldMutationTypes {
    SET = 'FIELD_MUTATION_TYPES_SET',
    INCREMENT = 'FIELD_MUTATION_TYPES_INCREMENT',
}
export interface IField<T> {
    val(): T;
}
export interface IMutableField<T> extends IMutable<IDatedMutation<FieldMutationTypes>>, IField<T> {}

export interface ISubscribableMutableField<T> extends ISubscribable<IDetailedUpdates>, IMutableField<T> {
}

// misc
export interface IVueConfigurer {
    configure()
}

// MathUtils

export type radian = number // between 0 and 2 pi
export type IPercentage = number // between 0 and 1

// mutations

export interface IMutable<MutationInterface/*: IMutation*/> {
    addMutation(mutation: MutationInterface), // idempotent.
    mutations(): MutationInterface[],
    /* TODO: Arrays are evil for firebase / distributed data.
     might have to replace this with a set.
      - https://firebase.googleblog.com/2014/04/best-practices-arrays-in-firebase.html
      - https://firebase.googleblog.com/2014/05/handling-synchronized-arrays-with-real.html*/
}
export interface IUndoableMutable<MutationInterface> extends IMutable<MutationInterface> {
    undo(mutationListIndex: number),
    redo(mutationListIndex: number)
}
export interface IMutation<MutationTypes> {
    type: MutationTypes,
    data
}
// mutation types
export interface IDatedMutation<MutationTypes> extends IMutation<MutationTypes> {
    timestamp: number // ISO 8601 POSIX Timestamp
}
export interface IProppedDatedMutation<MutationTypes, PropertyNames> extends IDatedMutation<MutationTypes> {
    propertyName: PropertyNames
}
export interface IIdProppedDatedMutation<MutationTypes, PropertyNames>
    extends IIdDatedMutation<MutationTypes> {
    propertyName: PropertyNames
}
export interface IIdDatedMutation<MutationTypes> extends IDatedMutation<MutationTypes> {
    id: string
}
export interface ITypeIdProppedDatedMutation<MutationTypes>
    extends IIdProppedDatedMutation<MutationTypes, AllPropertyNames> {
    objectType: ObjectTypes
}
export interface IActivatableMutation<MutationTypes> extends IMutation<MutationTypes> {
    active: boolean
}
export interface IActivatableDatedMutation<MutationTypes>
    extends IDatedMutation<MutationTypes>, IActivatableMutation<MutationTypes> {
}
export interface ICreateMutation<ObjectDataInterface> {
    objectType: ObjectTypes
    id?: string /* only should exist for ICreateMutation<IContentUserData>
     and ICreateMutation<ITreeLocation> and ICreateMutation<ITreeUserData> */
    data: ObjectDataInterface // e.g. ITreeData ... ITreeLocationData
    type: STORE_MUTATION_TYPES.CREATE_ITEM
}
export enum STORE_MUTATION_TYPES {
    CREATE_ITEM = 'STORE_MUTATION_TYPES_CREATE_ITEM',
    DELETE_ITEM = 'STORE_MUTATION_TYPES_DELETE_ITEM',
}
export type IGlobalMutation = ITypeIdProppedDatedMutation<AllPropertyMutationTypes>
    | ICreateMutation<any>

export enum SetMutationTypes {
    ADD = 'SetMutationTypes_ADD',
    REMOVE = 'SetMutationTypes_REMOVE'
}

export enum PointMutationTypes {
    SHIFT = 'PointMutationTypes_SHIFT'
}

export type TreePropertyMutationTypes = SetMutationTypes | FieldMutationTypes
export type TreeUserPropertyMutationTypes = FieldMutationTypes
export type TreeLocationPropertyMutationTypes = PointMutationTypes
export type ContentUserPropertyMutationTypes = FieldMutationTypes
export type ContentPropertyMutationTypes = FieldMutationTypes
export type AllPropertyMutationTypes = TreePropertyMutationTypes
    | TreeUserPropertyMutationTypes
    | TreeLocationPropertyMutationTypes
    | ContentUserPropertyMutationTypes
    | ContentPropertyMutationTypes

export enum ObjectDataTypes {
    TREE_DATA = 'TREE_DATA',
    TREE_LOCATION_DATA = 'TREE_LOCATION_DATA',
    TREE_USER_DATA = 'TREE_USER_DATA',
    CONTENT_DATA = 'CONTENT_DATA',
    CONTENT_USER_DATA = 'CONTENT_USER_DATA',
}
export enum ObjectTypes {
    TREE = 'TREE',
    TREE_LOCATION =  'TREE_LOCATION',
    TREE_USER = 'TREE_USER',
    CONTENT = 'CONTENT',
    CONTENT_USER = 'CONTENT_USER',
}

// UI Manager objects
export interface ITooltipOpener {
    openTooltip(node: ISigmaNode)
}
export interface ISigmaEventListener {
    startListening()
}

export type IAddNodeToSigma = (node: /* SigmaJs.Node & */ ISigmaNode) => void
// point
export interface ICoordinate {
    x: number,
    y: number
}

export interface IPoint {
    val(): ICoordinate,
    // Points can have their coordinate shifted by another coordinate
}
export interface IUndoableMutablePoint extends IUndoableMutable<IDatedMutation<PointMutationTypes>>, IPoint { }

export interface IMutableSubscribablePoint  extends ISubscribable<IDetailedUpdates>, IUndoableMutablePoint { }

// proficiencyStats

export interface IProficiencyStats {
    UNKNOWN: number,
    ONE: number,
    TWO: number,
    THREE: number,
    FOUR: number,
}

// set

export interface IMutableStringSet extends IMutable<IDatedMutation<SetMutationTypes>>, ISet<string> {
}

export interface ISet<T> {
    val(): T[],
}

export interface ISubscribableMutableStringSet extends ISubscribable<IDetailedUpdates>, IMutableStringSet {
}

// sigmaNode

export interface ISigmaUpdater {
    // refresh(): void
    addNode(node/*: SigmaJs.Node*/): void
}
export type fGetSigmaIdsForContentId = (id: string) => string[]
export interface ISigmaNodesUpdater {
    handleUpdate(update: ITypeAndIdAndValUpdates)
}

export type ISigmaNodes = IHash<SigmaNode>
export type ISigma = any
// export interface ISigma {
//     graph?: any,
//     refresh?(arg: any): any,
// }

export interface IColorSlice {
    color: UIColor
    start: radian
    end: radian
}

export interface IEditableSigmaNode {
    receiveNewContentData(contentData: IContentData)
    receiveNewContentUserData(contentUserData: IContentUserData)
    receiveNewTreeLocationData(treeLocationData: ITreeLocationData)
    receiveNewTreeUserData(treeUserData: ITreeUserData)
    receiveNewTreeData(treeData: ITreeDataWithoutId)
// TODO handle some of the receiveNewTreeData (parentId, children) in another class
}

/*
SigmaNode doesn't have to know anything about the user or userId . . .
It just has to know about the userContentData or userTreeData
 */
export interface ISigmaNode extends ISigmaNodeData, IEditableSigmaNode {
    // new(args: SigmaNodeArgs)
}

export interface ISigmaNodeData {
    id: string;
    parentId: string;
    contentId: string;
    children: string[];
    x: number;
    y: number;
    aggregationTimer: number;
    content: IContentData;
    contentUserId: string;
    contentUserData: IContentUserData;
    label: string;
    size: number;
    colorSlices: IColorSlice[];
    proficiencyStats: IProficiencyStats;
    proficiency: PROFICIENCIES;
    overdue: boolean;
}

// SigmaNodeCreator
export interface ISigmaNodeCreatorCore {
    receiveNewTreeData({treeId, treeData}: {treeId: string, treeData: ITreeDataWithoutId})
    receiveNewTreeLocationData({treeId, treeLocationData}: {treeId: string, treeLocationData: ITreeLocationData} )
    receiveNewTreeUserData({treeId, treeUserData}: {treeId: string, treeUserData: ITreeUserData})
    receiveNewContentData({contentId, contentData}: {contentId: string, contentData: IContentData})
    receiveNewContentUserData({contentId, contentUserData}: {contentId: string, contentUserData: IContentUserData})
}
export interface IManagedSigmaNodeCreatorCore extends ISigmaNodeCreatorCore {
}
export interface ISigmaNodeCreator {
    receiveUpdate(update: ITypeAndIdAndValUpdates)
}
export interface IStoreSourceUpdateListener extends ISubscriber<ITypeAndIdAndValUpdates> {}
// SigmaRendererManager
export interface IStoreSourceUpdateListenerCore {
    receiveUpdate(update: ITypeAndIdAndValUpdates)
}
export interface ISigmaRenderManager extends ISubscribable<ISigmaIdToRender> {
    markTreeDataLoaded(treeId)
    markTreeLocationDataLoaded(treeId)
}
export interface IRenderedNodesManagerCore {
    addToRenderList(sigmaId: string)
}
export interface IRenderedNodesManager extends ISubscriber<ISigmaIdToRender> {}

export type ITooltipRendererFunction = (node: ISigmaNode, template) => any
export interface ITooltipRenderer {
    renderer: (node: ISigmaNodeData, template) => any
    getTooltipsConfig(): object
    // renderer: ITooltipRendererFunction
}

export type Constructor = {
    new (...args: any[]): any;
}

// newLocationCalculator

export type fXYField = (coord: ICoordinate) => number

// stores

export interface IMutableSubscribableGlobalStore
    extends ISubscribableGlobalStore, IMutable<IGlobalMutation> {
}

export interface ISubscribableGlobalStore extends ISubscribable<ITypeAndIdAndValUpdates>,
    IDescendantPublisher {
}

export interface ICoreSubscribableStore<UpdatesType, ObjectType> extends IDescendantPublisher {
    addAndSubscribeToItem(id: any, item: ISubscribable<UpdatesType> & ObjectType)
}

export interface IMutableSubscribableTreeStore
    extends ISubscribableTreeStore,
        IMutable<IIdProppedDatedMutation<TreePropertyMutationTypes, TreePropertyNames>> {
    addAndSubscribeToItemFromData(
        {id, treeDataWithoutId}: {id: string, treeDataWithoutId: ITreeDataWithoutId}
    ): ISyncableMutableSubscribableTree
}

export interface IMutableSubscribableTreeUserStore
    extends ISubscribableTreeUserStore,
        IMutable<IIdProppedDatedMutation<TreeUserPropertyMutationTypes, TreeUserPropertyNames>> {
}

export interface IMutableSubscribableTreeLocationStore
    extends ISubscribableTreeLocationStore,
        IMutable<IIdProppedDatedMutation<TreeLocationPropertyMutationTypes, TreeLocationPropertyNames>> {
    addAndSubscribeToItemFromData(
        {id, treeLocationData}: {id: string, treeLocationData: ITreeLocationData}
    ): IMutableSubscribableTreeLocation
}

export interface IMutableSubscribableContentUserStore
    extends ISubscribableContentUserStore,
        IMutable<IIdProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames>> {
    addAndSubscribeToItemFromData(
        {id, contentUserData}: {id: string, contentUserData: IContentUserData}
        ): IMutableSubscribableContentUser
}
export interface IAutoSaveMutableSubscribableContentUserStore extends IMutableSubscribableContentUserStore {
}

export interface IMutableSubscribableContentStore
    extends ISubscribableContentStore,
        IMutable<IIdProppedDatedMutation<ContentPropertyMutationTypes, ContentPropertyNames>> {
    addAndSubscribeToItemFromData(
        {id, contentData}: {id: string, contentData: IContentData}
    ): IMutableSubscribableContent
}

export interface ISubscribableStore<SubscribableCoreInterface> extends ISubscribable<IIdAndValUpdates>,
    ICoreSubscribableStore<IIdAndValUpdates, SubscribableCoreInterface> {}

export interface ISubscribableTreeStore
    extends ISubscribableStore<ISubscribableTreeCore> {}

export interface ISubscribableTreeUserStore
    extends ISubscribableStore<ISubscribableTreeUserCore> {}

export interface ISubscribableTreeLocationStore
    extends ISubscribableStore<ISubscribableTreeLocationCore> {}

export interface ISubscribableContentUserStore
    extends ISubscribableStore<ISubscribableContentUserCore> {}

export interface ISubscribableContentStore
    extends ISubscribableStore<ISubscribableContentCore> {}

export type IValUpdates = any
export interface IIdAndValUpdates {
    id: any,
    val: any
}
export interface ITypeAndIdAndValAndObjUpdates extends ITypeAndIdAndValUpdates {
    obj
}
export interface ITypeAndIdAndValUpdates extends IIdAndValUpdates {
    type: ObjectDataTypes
}
export type ObjectDataDataTypes = ITreeDataWithoutId & ITreeUserData &
    ITreeLocationData & IContentData & IContentUserData & ICoordinate

// subscribable
export type IUpdatesCallback<UpdateObjectType> = (updates: UpdateObjectType) => void;

export interface ISubscribable<UpdateObjectType> {
    onUpdate(func: IUpdatesCallback<UpdateObjectType>);
}

export interface ISubscriber<UpdateObjectType> {
    subscribe(obj: ISubscribable<UpdateObjectType>)
}

export interface IDescendantPublisher {
    startPublishing()
}
export interface ISigmaIdToRender {
    sigmaIdToRender: string
}

export type AllPropertyNames = TreePropertyNames | TreeUserPropertyNames |
    TreeLocationPropertyNames | ContentUserPropertyNames | ContentPropertyNames

export interface IHash<T> {
    [id: string]: T
}
export interface IOneToManyMap<T> {
    get(id: string): T[]
    set(id: string, item: T)
}
export interface IMap<T> {
    get(id: string): T
    set(id: string, item: T)
    entries(): Array<entry<T>>
}
export type entry<T> = [string, T]

// IStoreSource
export interface ISubscribableStoreSource<T> extends IMap<T>, ISubscribable<ITypeAndIdAndValUpdates> {}
export interface ISubscribableTreeStoreSource
    extends IMap<ISyncableMutableSubscribableTree>, ISubscribable<ITypeAndIdAndValUpdates> {}
export interface ISubscribableTreeLocationStoreSource
    extends IMap<ISyncableMutableSubscribableTreeLocation>, ISubscribable<ITypeAndIdAndValUpdates> {}
export interface ISubscribableTreeUserStoreSource
    extends IMap<ISyncableMutableSubscribableTreeUser>, ISubscribable<ITypeAndIdAndValUpdates> {}
export interface ISubscribableContentStoreSource
    extends IMap<ISyncableMutableSubscribableContent>, ISubscribable<ITypeAndIdAndValUpdates> {}
export interface ISubscribableContentUserStoreSource
    extends IMap<ISyncableMutableSubscribableContentUser>, ISubscribable<ITypeAndIdAndValUpdates> {}

// components
export interface ITreeComponentCreator extends IVueComponentCreator {

}
export interface INewTreeComponentCreator extends IVueComponentCreator {

}
export type id = string
export interface INewChildTreeArgs {
    parentTreeId, timestamp, contentType, question, answer, title, parentX, parentY,
}
// tree
export interface ITree {
    getId(): string;
    contentId: IMutableField<string>;
    parentId: IMutableField<string>;
    children: IMutableStringSet;
}
export interface ITreeDataWithoutId {
    contentId: id;
    parentId: id;
    children: id[];
}
export interface ITreeDataFromFirebase {
    contentId: {
        val: string,
        mutations?
    },
    parentId: {
        val: string,
        mutations?
    },
    children: {
        val: IHash<boolean>,
        mutations?
    },
}
export interface ITreeData extends ITreeDataWithoutId {
    id: string;
}

export interface ICreateTreeMutationArgs {
    parentId: id, contentId: id, children?: id[]
}
export interface ICreateTreeLocationMutationArgs {
    treeId: id, x: number, y: number
}
export interface ISubscribableTreeCore extends ITree {
    contentId: ISubscribableMutableField<string>
    parentId: ISubscribableMutableField<string>
    children: ISubscribableMutableStringSet
    val(): ITreeDataWithoutId
}
export interface IValable {
    val()
}

export enum TreePropertyNames {
    CONTENT_ID = 'CONTENT_ID',
    PARENT_ID = 'PARENT_ID',
    CHILDREN = 'CHILDREN',
}

export interface ISubscribableTree extends ISubscribable<IValUpdates>,
    ISubscribableTreeCore, IDescendantPublisher { }

export interface IMutableSubscribableTree
    extends ISubscribableTree, IMutable<IProppedDatedMutation<TreePropertyMutationTypes, TreePropertyNames>> {}
// treeUser

export interface ITreeUser {
    proficiencyStats: IMutableField<IProficiencyStats>,
    aggregationTimer: IMutableField<number>,
}

export interface ISubscribableTreeUserCore extends ITreeUser {
    proficiencyStats: ISubscribableMutableField<IProficiencyStats>,
    aggregationTimer: ISubscribableMutableField<number>,
    val(): ITreeUserData
}

export enum TreeUserPropertyNames {
    PROFICIENCY_STATS = 'STATS',
    AGGREGATION_TIMER = 'AGGREGATION_TIMER',
}

export interface ISubscribableTreeUser extends
    ISubscribable<IValUpdates>, ISubscribableTreeUserCore, IDescendantPublisher {}

export interface IMutableSubscribableTreeUser
    extends ISubscribableTreeUser,
        IMutable<IProppedDatedMutation<TreeUserPropertyMutationTypes, TreeUserPropertyNames>> {}

export interface ITreeUserData {
    proficiencyStats: IProficiencyStats,
    aggregationTimer: number,
}

// treeLocation
export interface ITreeLocation {
    point: IUndoableMutablePoint,
}

export interface ISubscribableTreeLocationCore extends ITreeLocation {
    point: IMutableSubscribablePoint,
    val(): ITreeLocationData
}

export enum TreeLocationPropertyNames {
    POINT = 'point',
}

export interface ISubscribableTreeLocation extends
    ISubscribable<IValUpdates>, ISubscribableTreeLocationCore, IDescendantPublisher {}

export interface IMutableSubscribableTreeLocation
    extends ISubscribableTreeLocation,
        IMutable<IProppedDatedMutation<TreeLocationPropertyMutationTypes, TreeLocationPropertyNames>> {}

export interface ITreeLocationData {
    point: ICoordinate
}

export interface ITreeLocationDataFromFirebase {
    point: {
        val: ICoordinate
    },
}

// ui
export interface IUI extends ISubscriber<ITypeAndIdAndValUpdates> {}
