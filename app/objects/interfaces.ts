// tslint:disable no-empty-interface

// app
import {CONTENT_TYPES} from './contentItem/ContentTypes';
import {ObjectDataTypes} from './dataStores/ObjectTypes';
import {PROFICIENCIES} from './proficiency/proficiencyEnum';
import {SetMutationTypes} from './set/SetMutationTypes';
import {UIColor} from './uiColor';

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

// dataStores
interface ISubscribableGlobalDataStoreCore {
    startBroadcasting()
}

interface ISubscribableGlobalDataStore extends ISubscribable<ITypeAndIdAndValUpdates>,
    ISubscribableGlobalDataStoreCore {
}
interface IMutableGlobalDataStore {
    // addMutation(mutation: )
}

interface ICoreSubscribableDataStore<UpdatesType, ObjectType> {
    addAndSubscribeToItem(id: any, item: ISubscribable<UpdatesType> & ObjectType)
    subscribeToAllItems()
}
interface ISubscribableDataStore<UpdatesType, ObjectType>
    extends ISubscribable<IIdAndValUpdates>, ICoreSubscribableDataStore<UpdatesType, ObjectType> {
}

type IValUpdates = any
interface IIdAndValUpdates {
    id: any,
    val: any
}
interface ITypeAndIdAndValUpdates extends IIdAndValUpdates {
    type: ObjectDataTypes
}
type ObjectDataDataTypes = IBasicTreeDataWithoutId & ITreeUserData & IContentData & IContentUserData & ICoordinate

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

// id

enum IdMutationTypes {
    SET
}
interface IId {
    val();
}
interface IMutableId extends IMutable<IDatedMutation<IdMutationTypes>>, IId {}

interface ISubscribableMutableId extends ISubscribable<IDetailedUpdates>, IMutableId {
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
interface IActivatableMutation<MutationTypes> extends IMutation<MutationTypes> {
    active: boolean
}
interface IActivatableDatedMutation<MutationTypes>
    extends IDatedMutation<MutationTypes>, IActivatableMutation<MutationTypes> {
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
    receiveNewTreeData(treeUserData: IBasicTreeDataWithoutId)
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
interface IBasicTree {
    getId(): string;
    contentId: IMutableId;
    parentId: IMutableId;
    children: IMutableStringSet;
}
interface IBasicTreeDataWithoutId {
    contentId: string;
    parentId: string;
    children: string[];
}
interface IBasicTreeData extends IBasicTreeDataWithoutId {
    id: string;
}

interface ISubscribableBasicTreeCore extends IBasicTree {
    contentId: ISubscribableMutableId
    parentId: ISubscribableMutableId
    children: ISubscribableMutableStringSet
    val(): IBasicTreeDataWithoutId
}

interface ITreeMutation {
    type: TreeMutationType,
}
enum TreeMutationType {
    ADD_LEAF,
    REMOVE_LEAF,
}

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
    IMutableGlobalDataStore,
    IUndoableMutable,
    ISubscribableDataStore,

    // dbSync
    IFirebaseRef,
    IPushable,
    IDatabaseSaver,
    IDatabaseSyncer,
    IDBSubscriber,
    ISaveUpdatesToDBFunction,

    // id
    IdMutationTypes,
    IId,
    IMutableId,
    ISubscribableMutableId,

    // MathUtils
    radian,
    IPercentage,

    // mutations
    IMutation,
    IDatedMutation,
    IActivatableMutation,
    IActivatableDatedMutation,
    ///
    ITypeAndIdAndValUpdates,
    IIdAndValUpdates,
    IMutable,
    ISigmaNodeHandlerSubscriber,
    IValUpdates,
    ObjectDataDataTypes,

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
    IBasicTree,
    IBasicTreeDataWithoutId,
    IBasicTreeData,
    ISubscribableBasicTreeCore,
    ITreeMutation,
    TreeMutationType,

    // treeUserData
    ITreeUserData,
}
