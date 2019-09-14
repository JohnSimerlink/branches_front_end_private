// tslint:disable no-empty-interface
// tslint:disable no-namespace
import {PROFICIENCIES} from './proficiency/proficiencyEnum';
import {UIColor} from './uiColor';
import {Store} from 'vuex';
import {EDGE_TYPES} from './sigmaEdge/edgeTypes';
import * as firebase
	from 'firebase';
import {INTERACTION_MODES} from '../core/store/interactionModes';
import {IFlashcardTreeData} from './flashcardTree/IFlashcardTreeData';
import Heap = require('heap');
import {MAP_STATES} from './mapStateManager/MAP_STATES';
// import {SigmaJs} from 'sigmajs';

// app
export interface IApp {
	start();
}

// components
export interface Iterable {
	[Symbol.iterator]();
}

export interface IFactory {
	create();
}

export interface IVueComponentCreator extends IFactory {
}

export interface IKnawledgeMapCreator extends IVueComponentCreator {
}

export interface ICardMainCreator extends IVueComponentCreator {
}
export interface IMainMenuCreator extends IVueComponentCreator {
}

export interface IVuexStore extends Store<any> {
}

export interface IMapStateManager {
	init()
	enterMainMode()
	enterDarkMode()
	getMapState(): MAP_STATES

}

export interface ISigmaNodeLoader {
	loadIfNotLoaded(sigmaid: id): Promise<ISigmaLoadData>;
}

export interface ITreeLoader {
	getData(treeId: id): ITreeDataWithoutId;

	getItem(treeId: id): ISyncableMutableSubscribableTree;

	downloadData(treeId: id): Promise<ITreeDataWithoutId>;

	isLoaded(treeId: id): boolean;
}

export interface ITreeLocationLoader {
	getData(treeId: id): ITreeLocationData;

	getItem(treeId: id): ISyncableMutableSubscribableTreeLocation;

	downloadData(treeId: id): Promise<ITreeLocationData>;

	isLoaded(treeId: id): boolean;
}

export interface ITreeUserLoader {
	getData({treeId, userId}): ITreeUserData;

	// getItem({treeId, userId}): ISyncableMutableSubscribableTreeUser
	downloadData({treeId, userId}): Promise<ITreeUserData>;

	isLoaded({treeId, userId}): boolean;
}

export interface IContentLoader {
	getData(contentId: id): IContentData;

	getItem(contentId: id): ISyncableMutableSubscribableContent;

	downloadData(contentId: id): Promise<IContentData>;

	isLoaded(contentId: id): boolean;
}

export interface IContentUserLoader {
	getData({contentId, userId}): IContentUserData;

	getItem({contentUserId}): ISyncableMutableSubscribableContentUser;

	downloadData({contentId, userId}): Promise<IContentUserData>;

	isLoaded({contentId, userId}): boolean;
}

export interface IUserLoader {
	downloadUser(userId: id): Promise<ISyncableMutableSubscribableUser>;
}

export interface IBranchesMapLoaderCore {
	load(mapId: id): Promise<ISyncableMutableSubscribableBranchesMap>;
}

export interface IBranchesMapLoader {
	loadIfNotLoaded(mapId: id): Promise<ISyncableMutableSubscribableBranchesMap>;
}

export interface ISigmaNodeLoaderCore {
	load(sigmaId: id):
		Promise<ISigmaLoadData>;

	setUserId(userId: id);
}

export interface ISigmaLoadData {
	treeDataWithoutId: ITreeDataWithoutId;
	treeLocationData: ITreeLocationData;
	contentData: IContentData;
	contentUserData: IContentUserData;
}

export interface IFamilyLoader {
	loadFamilyIfNotLoaded(sigmaId: id);
}

export interface IFamilyLoaderCore {
	loadFamily(sigmaId: id);
}

// content

export enum CONTENT_TYPES {
	LOADING = 'loading',
	MAP = 'map',
	SKILL = 'skill',
	CATEGORY = 'heading', // heading, bc of backwards compatability
	FLASHCARD = 'fact',
}

export interface IContent {
	type: IMutableField<CONTENT_TYPES>;
	question: IMutableField<string>;
	answer: IMutableField<string>;
	title: IMutableField<string>;
}

export interface ISubscribableContentCore extends IContent {
	type: IMutableSubscribableField<CONTENT_TYPES>;
	question: IMutableSubscribableField<string>;
	answer: IMutableSubscribableField<string>;
	title: IMutableSubscribableField<string>;

	val(): IContentData;
}

export interface IContentDataFact {
	type: CONTENT_TYPES;
	question: string;
	answer: string;
	title?: string; // << shouldn't exist
}

export interface IContentDataNotFact {
	type: CONTENT_TYPES;
	title: string;
	question?: string; // <shouldn't exist
	answer?: string; // <shouldn't exist
}

export type IContentDataEither =
	IContentDataFact
	| IContentDataNotFact;

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
	};
	question?: {
		val: string
	};
	answer?: {
		val: string
	};
	title?: {
		val: string
	};
}

export enum ContentPropertyNames {
	TYPE = 'TYPE',
	QUESTION = 'QUESTION',
	ANSWER = 'ANSWER',
	TITLE = 'TITLE',
}

export interface ISubscribableContent extends ISubscribable<IValUpdate>, ISubscribableContentCore, IDescendantPublisher {
}

export interface IMutableSubscribableContent
	extends ISubscribableContent,
		IMutable<IProppedDatedMutation<ContentPropertyMutationTypes, ContentPropertyNames>> {
}

// contentUser

export interface IContentUser {
	overdue: IMutableField<boolean>;
	timer: IMutableField<number>;
	proficiency: IMutableField<PROFICIENCIES>;
	lastEstimatedStrength: IMutableField<number>;
	// ^^ TODO: this might actually be an branchesMap not a simple number
}

export interface ISubscribableContentUserCore extends IContentUser {
	overdue: IMutableSubscribableField<boolean>;
	timer: IMutableSubscribableField<number>;
	proficiency: IMutableSubscribableField<PROFICIENCIES>;
	lastEstimatedStrength: IMutableSubscribableField<number>;
	lastInteractionTime: IMutableSubscribableField<timestamp>;
	nextReviewTime: IMutableSubscribableField<timestamp>;

	val(): IContentUserData;
}

export enum ContentUserPropertyNames {
	OVERDUE = 'VERDUE',
	TIMER = 'TIMER',
	PROFICIENCY = 'PROFICIENCY',
	LAST_ESTIMATED_STRENGTH = 'LAST_ESTIMATED_STRENGTH',
	LAST_INTERACTION_TIME = 'LAST_INTERACTION_TIME',
	NEXT_REVIEW_TIME = 'NEXT_REVIEW_TIME',
}

export type decibels = number;

export interface ISubscribableContentUser extends ISubscribable<IValUpdate>, ISubscribableContentUserCore, IDescendantPublisher {
}

export interface IMutableSubscribableContentUser
	extends ISubscribableContentUser,
		IMutable<IProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames>> {
}

export interface ISyncableMutableSubscribableContentUser extends IMutableSubscribableContentUser, ISyncable {
}

export interface ISyncableMutableSubscribableContent extends IMutableSubscribableContent, ISyncable {
}

export interface ISyncableMutableSubscribableTree extends IMutableSubscribableTree, ISyncable {
}

export interface ISyncableMutableSubscribableTreeLocation extends IMutableSubscribableTreeLocation, ISyncable {
}

export interface ISyncableMutableSubscribableTreeUser extends IMutableSubscribableTreeUser, ISyncable {
}

export interface ISyncableMutableSubscribableUser extends IMutableSubscribableUser, ISyncable {
}

export interface ISyncableMutableSubscribableBranchesMap extends IMutableSubscribableBranchesMap, ISyncable {
}

export interface IAwesomeObject<PropertyMutationTypes, PropertyNames>
	extends ISyncable, IMutable<IProppedDatedMutation<PropertyMutationTypes, PropertyNames>>,
		ISubscribable<IValUpdate> {
}

export interface ICreateBranchesMapReturnObject {
	branchesMap: ISyncableMutableSubscribableBranchesMap;
	id: id;
}

export interface IContentUserData {
	id: string;
	overdue: boolean;
	timer: number;
	proficiency: PROFICIENCIES;
	lastEstimatedStrength: number;
	lastInteractionTime: timestamp;
	nextReviewTime: timestamp;
}

export interface IContentUserDataFromDB {
	id: string;
	overdue: {
		val: boolean,
	};
	timer: {
		val: number,
	};
	proficiency: {
		val: PROFICIENCIES
	};
	lastRecordedStrength: {
		val: number
	};
	lastInteractionTime: {
		val: timestamp
	};
	nextReviewTime: {
		val: timestamp
	};
}

export type seconds = number;
export type percentage = number; // Range is [0, 1] or [0, 100]
export type percentage_as_decimal = number; // Range is [0, 1]
export type percentage_as_number = number; // Range is [0, 100]
export type milliseconds = number;

export interface IOverdueListener extends IStartable {

}

export interface IOverdueListenerCore {
	setOverdueTimer();

	listenAndReactToAnyNextReviewTimeChanges();
}

// dbSync

export interface IObjectFirebaseAutoSaver {
	initialSave();

	start();
}

export interface IDatabaseSaver {
	save(updates: IDetailedUpdates);
}

export type ISaveUpdatesToDBFunction = (updates: IDetailedUpdates) => void;

export interface IDatabaseAutoSaver extends ISubscriber<IDetailedUpdates> {
}

export interface IDBSubscriber {
	subscribe();
}

export interface IDBSubscriberToTreeLocation extends IDBSubscriber {
}

export interface IDBSubscriberToTree extends IDBSubscriber {
}

export interface IDetailedUpdates {
	updates?: object;
	pushes?: object;
}

export interface ISyncable {
	getPropertiesToSync(): IHash<ISubscribable<IDetailedUpdates> & IDbValable>;
}

export interface ISyncableValable extends IValable, ISyncable {
}

export interface ISnapshot {
	val(): any;
}

export interface IPushable {
	push(item: any);
}

// field

export interface IField<T> {
	val(): T;

	dbVal(): T;
}

export interface IMutableField<T> extends IMutable<IDatedMutation<FieldMutationTypes>>, IField<T> {
}

export interface IMutableSubscribableField<T> extends ISubscribable<IDetailedUpdates>, IMutableField<T> {
}

// misc
export interface IVueConfigurer {
	configure();
}

// MathUtils

export type radian = number; // between 0 and 2 pi
export type IPercentage = number; // between 0 and 1

// mutations

export interface IMutable<MutationInterface/*: IMutation*/> {
	addMutation(mutation: MutationInterface); // idempotent.
	mutations(): MutationInterface[];

	/* TODO: Arrays are evil for firebase / distributed data.
	 might have to replace this with a set.
		- https://firebase.googleblog.com/2014/04/best-practices-arrays-in-firebase.html
		- https://firebase.googleblog.com/2014/05/handling-synchronized-arrays-with-real.html*/
}

export interface IUndoableMutable<MutationInterface> extends IMutable<MutationInterface> {
	undo(mutationListIndex: number);

	redo(mutationListIndex: number);
}

export interface IMutation<MutationTypes> {
	type: MutationTypes;
	data;
}

// mutation types
export interface IDatedMutation<MutationTypes> extends IMutation<MutationTypes> {
	timestamp: number; // ISO 8601 POSIX Timestamp
}

export interface IProppedDatedMutation<MutationTypes, PropertyNames> extends IDatedMutation<MutationTypes> {
	propertyName: PropertyNames;
}

export interface IIdDatedMutation<MutationTypes> extends IDatedMutation<MutationTypes> {
	id: string;
}

export interface IIdProppedDatedMutation<MutationTypes, PropertyNames>
	extends IIdDatedMutation<MutationTypes> {
	propertyName: PropertyNames;
}

export interface ITypeIdProppedDatedMutation<MutationTypes>
	extends IIdProppedDatedMutation<MutationTypes, AllPropertyNames> {
	objectType: GlobalStoreObjectTypes;
}

export interface IEditMutation<MutationTypes>
	extends ITypeIdProppedDatedMutation<MutationTypes> {

}

export interface IActivatableMutation<MutationTypes> extends IMutation<MutationTypes> {
	active: boolean;
}

export interface IActivatableDatedMutation<MutationTypes>
	extends IDatedMutation<MutationTypes>, IActivatableMutation<MutationTypes> {
}

export interface ICreateMutation<ObjectDataInterface> {
	objectType: GlobalStoreObjectTypes;
	id?: string;
	/* only should exist for ICreateMutation<IContentUserData>
			and ICreateMutation<ITreeLocation> and ICreateMutation<ITreeUserData> */
	data: ObjectDataInterface; // e.g. ITreeData ... ITreeLocationData
	type: STORE_MUTATION_TYPES.CREATE_ITEM;
}

export enum STORE_MUTATION_TYPES {
	CREATE_ITEM = 'STORE_MUTATION_TYPES_CREATE_ITEM',
	DELETE_ITEM = 'STORE_MUTATION_TYPES_DELETE_ITEM',
}

export type IGlobalMutation =
	ITypeIdProppedDatedMutation<GlobalStorePropertyMutationTypes>
	| ICreateMutation<any>;

export enum SetMutationTypes {
	ADD = 'SetMutationTypes_ADD',
	REMOVE = 'SetMutationTypes_REMOVE'
}

export enum PointMutationTypes {
	SHIFT = 'PointMutationTypes_SHIFT',
	SET = 'PointMutationTypes_SET'
}

export enum FieldMutationTypes {
	SET = 'FIELD_MUTATION_TYPES_SET',
	INCREMENT = 'FIELD_MUTATION_TYPES_INCREMENT',
	ADD = 'FIELD_MUTATION_TYPES_ADD',
}

export type TreePropertyMutationTypes =
	SetMutationTypes
	| FieldMutationTypes;
export type TreeUserPropertyMutationTypes = FieldMutationTypes;
export type TreeLocationPropertyMutationTypes = PointMutationTypes;
export type ContentUserPropertyMutationTypes = FieldMutationTypes;
export type ContentPropertyMutationTypes = FieldMutationTypes;
export type UserPropertyMutationTypes = FieldMutationTypes;
export type BranchesMapPropertyMutationTypes = FieldMutationTypes;
export type GlobalStorePropertyMutationTypes =
	TreePropertyMutationTypes
	| TreeUserPropertyMutationTypes
	| TreeLocationPropertyMutationTypes
	| ContentUserPropertyMutationTypes
	| ContentPropertyMutationTypes;

export enum CustomStoreDataTypes {
	TREE_DATA = 'TREE_DATA',
	TREE_LOCATION_DATA = 'TREE_LOCATION_DATA',
	TREE_USER_DATA = 'TREE_USER_DATA',
	CONTENT_DATA = 'CONTENT_DATA',
	CONTENT_USER_DATA = 'CONTENT_USER_DATA',
}

export enum GlobalStoreObjectTypes {
	TREE = 'TREE',
	TREE_LOCATION = 'TREE_LOCATION',
	TREE_USER = 'TREE_USER',
	CONTENT = 'CONTENT',
	CONTENT_USER = 'CONTENT_USER',
}

export type timestamp = number;

// map branchesMap
export interface IBranchesMapData {
	rootTreeId: id;
}

export interface IBranchesMap {
	rootTreeId: IMutableField<id>;
}

export interface ISubscribableBranchesMapCore extends IBranchesMap {
	rootTreeId: IMutableSubscribableField<id>;

	val(): IBranchesMapData;
}

export interface IBranchesMapDataFromDB {
	rootTreeId: {
		val: id;
	};
}

export enum BranchesMapPropertyNames {
	ROOT_TREE_ID = 'rootTreeId',
	EVER_ACTIVATED_MEMBERSHIP = 'everActivatedMembership',
}

export interface ISubscribableBranchesMap extends ISubscribable<IValUpdate>, ISubscribableBranchesMapCore, IDescendantPublisher {
}

export interface IMutableSubscribableBranchesMap
	extends ISubscribableBranchesMap,
		IMutable<IProppedDatedMutation<BranchesMapPropertyMutationTypes, BranchesMapPropertyNames>> {
}

export interface IBranchesMapUtils {
	createBranchesMapInDBAndAutoSave({rootTreeId}: ICreateMapMutationArgs): ICreateBranchesMapReturnObject;
}

export interface ISigmaCamera {
	goTo(location: ISigmaCameraLocation);
}

export interface ISigmaCameraLocation {
	angle?: number;
	ratio?: number;
	x?: number;
	y?: number;
}

// user branchesMap
export interface IUserData {
	membershipExpirationDate: timestamp;
	everActivatedMembership: boolean;
	points: number;
	rootMapId: id;
	userInfo: firebase.UserInfo;
	openMapId: id;
	currentHoveredTreeId: id;
	stripeId: id;
	stripeSubscriptionId: id;
	/* TODO: this could cause a bug where we have stored
+     what treeId the user is at . . .so we load that treeId, but then */
	// camera: ISigmaCameraLocation
}

export interface IUser {
	membershipExpirationDate: IMutableField<timestamp>;
	everActivatedMembership: IMutableField<boolean>;
	points: IMutableField<number>;
	rootMapId: IMutableField<id>;
	openMapId: IMutableField<id>;
	currentHoveredTreeId: IMutableField<id>;
	userInfo: IMutableField<firebase.UserInfo>;
}

export interface ISubscribableUserCore extends IUser {
	everActivatedMembership: IMutableSubscribableField<boolean>;
	membershipExpirationDate: IMutableSubscribableField<timestamp>;
	points: IMutableSubscribableField<number>;
	rootMapId: IMutableSubscribableField<id>;
	openMapId: IMutableSubscribableField<id>;
	currentHoveredTreeId: IMutableSubscribableField<id>;
	userInfo: IMutableSubscribableField<firebase.UserInfo>;

	val(): IUserData;
}

export interface IUserDataFromDB {
	membershipExpirationDate: {
		val: timestamp;
	};
	everActivatedMembership: {
		val: boolean;
	};
	points: {
		val: number
	};
	rootMapId: {
		val: id
	};
	openMapId: {
		val: id
	};
	currentHoveredTreeId: {
		val: id
	};
	userInfo: {
		val: firebase.UserInfo
	};
	stripeId: {
		val: id
	};
	stripeSubscriptionId: {
		val: id
	};
}

export enum UserPropertyNames {
	MEMBERSHIP_EXPIRATION_DATE = 'membershipExpirationDate',
	EVER_ACTIVATED_MEMBERSHIP = 'everActivatedMembership',
	POINTS = 'points',
	ROOT_MAP_ID = 'rootMapId',
	OPEN_MAP_ID = 'openMapId',
	CURRENT_HOVERED_TREE_ID = 'currentHoveredTreeId',
	USER_INFO = 'userInfo',
}

export interface ISubscribableUser extends ISubscribable<IValUpdate>, ISubscribableUserCore, IDescendantPublisher {
}

export interface IMutableSubscribableUser
	extends ISubscribableUser,
		IMutable<IProppedDatedMutation<UserPropertyMutationTypes, UserPropertyNames>> {
}

export interface IUserUtils {
	userExistsInDB(userId: id): Promise<boolean>;

	createUserInDB({userId, userInfo}
									 : ICreateUserInDBArgs): Promise<ISyncableMutableSubscribableUser>;
}

export interface ICreateUserInDBArgs {
	userId: id;
	userInfo: firebase.UserInfo;
}

// UI Manager objects
export interface ITooltipOpener {
	openPrimaryTooltip(node: ISigmaNode);

	openHoverTooltip(node: ISigmaNode);

	openAddTooltip(node: ISigmaNode);

	openEditTooltip(node: ISigmaNode);
}

export interface ISigmaEventListener {
	startListening();
}

export type IAddNodeToSigma = (node: /* SigmaJs.Node & */ ISigmaNode) => void;

// point
export interface ICoordinate {
	x: number;
	y: number;
}

export interface IPoint {
	val(): ICoordinate;

	dbVal(): ICoordinate;

	// Points can have their coordinate shifted by another coordinate
}

export interface IUndoableMutablePoint extends IUndoableMutable<IDatedMutation<PointMutationTypes>>, IPoint {
}

export interface IMutableSubscribablePoint extends ISubscribable<IDetailedUpdates>, IUndoableMutablePoint {
}

// proficiencyStats

export interface IProficiencyStats {
	UNKNOWN: number;
	ONE: number;
	TWO: number;
	THREE: number;
	FOUR: number;
}

// set

export interface IMutableStringSet extends IMutable<IDatedMutation<SetMutationTypes>>, ISet<string> {
}

export interface ISet<T> {
	val(): T[];

	dbVal(): IHash<boolean>; // hashmap of ids
}

export interface IMutableSubscribableStringSet extends ISubscribable<IDetailedUpdates>, IMutableStringSet {
}

// sigmaNode
export interface ISigmaEdgeUpdater {
	addEdge();
}

export interface IAddUserPointsMutationArgs {
	userId: id;
	points: number;
}

export interface IEditFactMutationArgs {
	contentId: id;
	question: string;
	answer: string;
}

export interface IEditCategoryMutationArgs {
	contentId: id;
	title: string;
}

export interface IAddNodeMutationArgs {
	node: ISigmaNodeData;
}

export interface IAddEdgeMutationArgs {
	edges: ISigmaEdgeData[];
}

export interface IAddParentEdgeMutationArgs {
	parentId;
	treeId;
	color: UIColor;
}

export interface ISetMembershipExpirationDateArgs {
	membershipExpirationDate: timestamp;
	userId: id;
}

export interface ISigmaUpdater {
	// refresh(): void
	addNode(node: ISigmaNodeData/*: SigmaJs.Node*/): void;

	addEdges(edges: ISigmaEdgeData[]/*: SigmaJs.Node*/): void;
}

export interface ISigmaEdgesUpdater {
	// refresh(): void
	handleUpdate(update: ITypeAndIdAndValUpdate);
}

export type fGetSigmaIdsForContentId = (id: string) => string[];

export interface ISigmaNodesUpdater {
	flip(nodeId: id)
	handleUpdate(update: ITypeAndIdAndValUpdate);

	highlightNode(nodeId: id); // TODO: maybe highlight methods should be extracted into a separate class . . .

	unHighlightNode(nodeId: id);
}

export interface ISigmaEdge extends ISigmaEdgeData {

}

export type ISigmaNodes = IHash<ISigmaNode>;
export type ISigmaEdges = IHash<ISigmaEdge>;

// export type ISigma = any
export interface IBindable {
	bind(eventName: string, callback: (event) => void);
}

// TODO: I think the interfaces are hopelessly comingled between being the Sigma Constructor and the Sigma Instance
export interface ISigma extends IBindable {
	graph?: ISigmaGraph; // sigma instance
	renderers: IBindable[]; // sigma instance
	camera: ISigmaCamera; // sigma instance
	cameras: ISigmaCamera[]; // sigma instance

	refresh?(): any; // sigma instance
}


export type fImportSigmaConstructor = () => ISigmaConstructor
export interface ISigmaConstructor {
	new(...args: any[]): ISigma;
	canvas: ISigmaCanvas;
	utils: any;
	renderers
	hovers
	classes
	misc

}
export interface ISigmaCanvas {
	nodes: {
		def: ISigmaNodeRenderer
	}
	hovers: {
		def: ISigmaNodeRenderer
	}
	labels: {
		def: ISigmaNodeRenderer
		prioritizable: ISigmaNodeRenderer
	}
}
export type ISigmaNodeRenderer = (node: ISigmaNode, context: CanvasRenderingContext2D, settings) => void

export interface IColorSlice {
	color: color;
	start: radian;
	end: radian;
}

export type color = string; // of the format rgba(x, y, z, w)

export interface IEditableSigmaNode {
	receiveNewContentData(contentData: IContentData);

	receiveNewContentUserData(contentUserData: IContentUserData);

	receiveNewTreeLocationData(treeLocationData: ITreeLocationData);

	receiveNewTreeUserData(treeUserData: ITreeUserData);

	receiveNewTreeData(treeData: ITreeDataWithoutId);

	highlight();

	unhighlight();

	focus();
	flip();

	unfocus();
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
	level: number;
	treeLocationData: ITreeLocationData;
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
	nextReviewTime: timestamp;
	highlighted: boolean;
	focused: boolean;
}

export interface ISigmaEdgeData {
	id: string;
	source: string;
	target: string;
	size: number;
	color: UIColor;
	type: EDGE_TYPES;
}

// SigmaNodeCreator
export interface ISigmaNodeCreatorCore {
	receiveNewTreeData({treeId, treeData}: { treeId: string, treeData: ITreeDataWithoutId });

	receiveNewTreeLocationData({treeId, treeLocationData}: { treeId: string, treeLocationData: ITreeLocationData });

	receiveNewTreeUserData({treeId, treeUserData}: { treeId: string, treeUserData: ITreeUserData });

	receiveNewContentData({contentId, contentData}: { contentId: string, contentData: IContentData });

	receiveNewContentUserData({contentId, contentUserData}: { contentId: string, contentUserData: IContentUserData });
}

export interface IManagedSigmaNodeCreatorCore extends ISigmaNodeCreatorCore {
}

export interface ISigmaNodeCreator {
	receiveUpdate(update: ITypeAndIdAndValUpdate);
}

export interface IStoreSourceUpdateListener extends ISubscriber<ITypeAndIdAndValUpdate> {
}

// SigmaRendererManager
export interface IStoreSourceUpdateListenerCore {
	receiveUpdate(update: ITypeAndIdAndValUpdate);
}

export interface ISigmaRenderManager extends ISubscribable<ISigmaRenderUpdate> {
	markTreeDataLoaded(treeId);

	markTreeLocationDataLoaded(treeId);

	addWaitingEdge(edgeId);
}

export interface IRenderManagerCore {
	addNodeToRenderList(sigmaId: string);

	addEdgesToRenderList(edgeIds: string[]);
}

export interface IRenderManager extends ISubscriber<ISigmaRenderUpdate> {
}

export type ITooltipRendererFunction = (node: ISigmaNode, template) => any;

export interface ITooltipConfigurer {
	// renderer: (node: ISigmaNodeData, template) => any;

	getTooltipsConfig(): object;

	getHovererTooltipsConfig(): object;

	getAddTooltipsConfig(): object;

	getEditTooltipsConfig(): object;

	// renderer: ITooltipRendererFunction
}

export interface Constructor {
	new(...args: any[]): any;
}

// newLocationCalculator

export type fXYField = (coord: ICoordinate) => number;

// mutationArgs
export interface ISetUserDataMutationArgs {
	userData: IUserData;
	userId: id;
}

export interface ILoginWithEmailMutationArgs {
	email: string
	password: string
}

export interface ICreateUserWithEmailMutationArgs extends ILoginWithEmailMutationArgs {
}

export interface ISetBranchesMapDataMutationArgs {
	branchesMapData: IBranchesMapData;
	branchesMapId: id;
}

export interface ISetBranchesMapIdMutationArgs {
	branchesMapData: IBranchesMapData;
	branchesMapId: id;
}

// stores

export interface IGlobalDataStoreBranchesStoreSyncer extends IStartable {
}

export interface IMutableSubscribableGlobalStore
	extends ISubscribableGlobalStore, IMutable<IGlobalMutation> {
}

export interface ISubscribableGlobalStore extends ISubscribable<ITypeAndIdAndValUpdate>,
	IDescendantPublisher {
}

export interface ICoreSubscribableStore<UpdatesType, ObjectType> extends IDescendantPublisher {
	addItem(id: any, item: ISubscribable<UpdatesType> & ObjectType);
}

export interface IMutableSubscribableTreeStore
	extends ISubscribableTreeStore,
		IMutable<IIdProppedDatedMutation<TreePropertyMutationTypes, TreePropertyNames>> {
	addAndSubscribeToItemFromData(
		{id, treeDataWithoutId}: { id: string, treeDataWithoutId: ITreeDataWithoutId }
	): ISyncableMutableSubscribableTree;
}

export interface IMutableSubscribableTreeUserStore
	extends ISubscribableTreeUserStore,
		IMutable<IIdProppedDatedMutation<TreeUserPropertyMutationTypes, TreeUserPropertyNames>> {
}

export interface IMutableSubscribableTreeLocationStore
	extends ISubscribableTreeLocationStore,
		IMutable<IIdProppedDatedMutation<TreeLocationPropertyMutationTypes, TreeLocationPropertyNames>> {
	addAndSubscribeToItemFromData(
		{id, treeLocationData}: { id: string, treeLocationData: ITreeLocationData }
	): IMutableSubscribableTreeLocation;
}

export interface IMutableSubscribableContentUserStore
	extends ISubscribableContentUserStore,
		IMutable<IIdProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames>> {
	addAndSubscribeToItemFromData(
		{id, contentUserData}: { id: string, contentUserData: IContentUserData }
	): IMutableSubscribableContentUser;
}

export interface ISyncableMutableSubscribableContentUserStore
	extends ISubscribableContentUserStore,
		IMutable<IIdProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames>> {
	addAndSubscribeToItemFromData(
		{id, contentUserData}: { id: string, contentUserData: IContentUserData }
	): ISyncableMutableSubscribableContentUser;
}

export interface IAutoSaveMutableSubscribableContentUserStore extends ISyncableMutableSubscribableContentUserStore {
}

export interface IMutableSubscribableContentStore
	extends ISubscribableContentStore,
		IMutable<IIdProppedDatedMutation<ContentPropertyMutationTypes, ContentPropertyNames>> {
	addAndSubscribeToItemFromData(
		{id, contentData}: { id: string, contentData: IContentData }
	): IMutableSubscribableContent;
}

export interface ISubscribableStore<SubscribableCoreInterface> extends ISubscribable<IIdAndValUpdate>,
	ICoreSubscribableStore<IIdAndValUpdate, SubscribableCoreInterface> {
}

export interface ISubscribableTreeStore
	extends ISubscribableStore<ISubscribableTreeCore> {
}

export interface ISubscribableTreeUserStore
	extends ISubscribableStore<ISubscribableTreeUserCore> {
}

export interface ISubscribableTreeLocationStore
	extends ISubscribableStore<ISubscribableTreeLocationCore> {
}

export interface ISubscribableContentUserStore
	extends ISubscribableStore<ISubscribableContentUserCore> {
}

export interface ISubscribableContentStore
	extends ISubscribableStore<ISubscribableContentCore> {
}

export type IValUpdate = any;

export interface IIdAndValUpdate {
	id: id;
	val: IValUpdate;
}

export type IStoreObjectUpdate = ITypeAndIdAndValAndObjUpdate;

export interface ITypeAndIdAndValAndObjUpdate extends ITypeAndIdAndValUpdate {
	obj;
}

export interface ITypeAndIdAndValUpdate extends IIdAndValUpdate {
	type: CustomStoreDataTypes;
}

export type ObjectDataDataTypes =
	ITreeDataWithoutId
	& ITreeUserData
	&
	ITreeLocationData
	& IContentData
	& IContentUserData
	& ICoordinate;

// subscribable
export type IUpdatesCallback<UpdateObjectType> = (updates: UpdateObjectType) => void;
export type IOverdueUpdate = {
	overdue: boolean
}

export interface IStoreGetters {
	getStore(): Store<any>;
	sigmaGraph(state: IState, getters): ISigmaGraph;
	sigmaNode(state, getters): (id: id) => ISigmaNode;
	sampleGetter: any
	sampleAsyncGetter: any
	userId(state: IState, getters): id;
	userData(state: IState, getters): (userId: id) => IUserData;
	userPoints(state: IState, getters): (userId: id) => number;
	contentUserLastEstimatedStrength(state: IState, getters): (id: id) => decibels;
	loggedIn(state: IState, getters): boolean;
	hasAccess(state: IState, getters): Promise<boolean>;
	userHasAccess(state: IState, getters): (id: id) => boolean;
	contentData(state: IState, getters: IStoreGetters): (id: id) => IContentData;
	contentUserData: Function;
	// (state: IState, getters: IStoreGetters): (id: id) => IContentUserData;
	// contentUserData(state: IState, getters: IStoreGetters): (id: id) => IContentUserData;
	playing(state: IState, getters: IStoreGetters): boolean;
	treeContentIsCategory(state: IState, getters: IStoreGetters): (treeId: id) => boolean;
	treeData(state: IState, getters: IStoreGetters): (id: id) => ITreeDataWithoutId;
	treeLocationData(state: IState, getters: IStoreGetters): (id: id) => ITreeLocationData;
	treeUserData(state: IState, getters: IStoreGetters): (id: id) => ITreeUserData;

}

export interface ISubscribable<UpdateObjectType> {
	onUpdate(func: IUpdatesCallback<UpdateObjectType>);
}

export interface ISubscriber<UpdateObjectType> {
	subscribe(obj: ISubscribable<UpdateObjectType>);
}

export interface IDescendantPublisher {
	startPublishing();
}

/* TODO: make the sigmaRenderingMechanism stateless,
 whereby this update contains the data that needs to be rendered,
 rather than the subscriber to the update having to fetch the data from an branchesMap */
export type ISigmaRenderUpdate =
	ISigmaRenderUpdateCore
	& (ISigmaRenderUpdateNewNode | ISigmaRenderUpdateNewEdge);

export enum RenderUpdateTypes {
	NEW_NODE = 'new_node',
	NEW_EDGE = 'new_edge',
	REMOVE_NODE = 'REMOVE_NODE',
	REMOVE_EDGE = 'REMOVE_EDGE',
}

export interface ISigmaRenderUpdateCore {
	type: RenderUpdateTypes;
}

export interface ISigmaRenderUpdateNewNode {
	sigmaNodeIdToRender: id;
	sigmaEdgeIdsToRender?: id[]; // << should be blank
}

export interface ISigmaRenderUpdateNewEdge {
	sigmaNodeIdToRender?: id; // << should be blank
	sigmaEdgeIdsToRender: id[];
}

export type AllPropertyNames =
	TreePropertyNames
	| TreeUserPropertyNames
	|
	TreeLocationPropertyNames
	| ContentUserPropertyNames
	| ContentPropertyNames;

export interface IHash<T> {
	[id: string]: T;
}

export interface IOneToManyMap<T> {
	get(id: string): T[];

	set(id: string, item: T);
}

export interface IMap<T> {
	get(id: string): T;

	set(id: string, item: T);

	entries(): Array<entry<T>>;
}

export type entry<T> = [string, T];

// IStoreSource
export interface ISubscribableStoreSource<T> extends IMap<T>, ISubscribable<ITypeAndIdAndValUpdate> {
}

export interface ISubscribableTreeStoreSource
	extends IMap<ISyncableMutableSubscribableTree>, ISubscribable<ITypeAndIdAndValUpdate> {
}

export interface ISubscribableTreeLocationStoreSource
	extends IMap<ISyncableMutableSubscribableTreeLocation>, ISubscribable<ITypeAndIdAndValUpdate> {
}

export interface ISubscribableTreeUserStoreSource
	extends IMap<ISyncableMutableSubscribableTreeUser>, ISubscribable<ITypeAndIdAndValUpdate> {
}

export interface ISubscribableContentStoreSource
	extends IMap<ISyncableMutableSubscribableContent>, ISubscribable<ITypeAndIdAndValUpdate> {
}

export interface ISubscribableContentUserStoreSource
	extends IMap<ISyncableMutableSubscribableContentUser>, ISubscribable<ITypeAndIdAndValUpdate> {
}

// store
export interface ISigmaGraph {
	addNode(node: ISigmaNodeData);

	addEdge(edge: ISigmaEdgeData);

	nodes(id?: id): ISigmaNode & ISigmaNode[];
	edges(id?: id): ISigmaEdge & ISigmaEdge[];
}

export interface ISigmaGraphData {
	nodes: ISigmaNodeData[];
	edges: ISigmaEdgeData[];
}

export interface IBranchesMapRenderer {
	mapIdToRender: id;
}

export interface IState {
	branchesMapsData: IHash<IBranchesMapData>;
	branchesMapLoader: IBranchesMapLoader;
	branchesMaps: IHash<ISyncableMutableSubscribableBranchesMap>;
	branchesMapUtils: IBranchesMapUtils;
	cardOpen: boolean;
	contentIdSigmaIdsMap: IOneToManyMap<id>;
	currentHighlightedNodeId: id;
	currentlyPlayingCategoryId: id;
	currentOpenTreeId: id;
	currentFlippedFlashcards: id[];
	centeredTreeId: string;
	currentMapId: string;
	currentStudyHeap: Heap<IFlashcardTreeData>;
	editingCardId: string;
	editingCardContentId: string;
	editingCardTitle: string;
	getTooltips: () => any;
	graphData: ISigmaGraphData;
	graph: ISigmaGraph;
	globalDataStore: IMutableSubscribableGlobalStore;
	globalDataStoreData: {
		content: IHash<IContentData>,
		contentUsers: IHash<IContentUserData>,
		trees: IHash<ITreeDataWithoutId>,
		treeUsers: IHash<ITreeUserData>,
		treeLocations: IHash<ITreeLocationData>,
	};
	globalDataStoreObjects: {
		content: IHash<ISyncableMutableSubscribableContent>,
		contentUsers: IHash<ISyncableMutableSubscribableContentUser>,
		trees: IHash<ISyncableMutableSubscribableTree>,
		treeUsers: IHash<ISyncableMutableSubscribableTreeUser>,
		treeLocations: IHash<ISyncableMutableSubscribableTreeLocation>,
	};
	hoveringCardId: string;
	interactionMode: INTERACTION_MODES;
	loginWithEmailErrorMessage: string;
	mapStateManager: IMapStateManager;
	mobileCardOpen: boolean;
	renderer: IBranchesMapRenderer;
	sigmaFactory: ISigmaFactory;
	sigmaInitialized: boolean;
	sigmaInstance: ISigma;
	sigmaNodeLoader: ISigmaNodeLoader;
	sigmaNodeLoaderCore: ISigmaNodeLoaderCore;
	sigmaNodesUpdater: ISigmaNodesUpdater;
	sigmaEdgesUpdater: ISigmaEdgesUpdater;
	signUpWithEmailErrorMessage: string;
	tooltipVueInstance
	userId: string;
	userLoader: IUserLoader;
	usersData: IHash<IUserData>;
	users: IHash<ISyncableMutableSubscribableUser>;
	userUtils: IUserUtils;
	usersDataHashmapUpdated: number;
	uri: string;

}

export interface ISigmaFactory {
	plugins: ISigmaPlugins;

	init();

	create(args: any): ISigma;
}

export interface ISigmaPlugins {
	tooltips(sigmaInstance, renderer, tooltipsConfig);

	dragNodes(sigmaInstance, renderer);
}

// components
export interface ITreeComponentCreator extends IVueComponentCreator {

}

export interface INewTreeComponentCreator extends IVueComponentCreator {

}

// tree
export interface ITree {
	contentId: IMutableField<string>;
	parentId: IMutableField<string>;
	children: IMutableStringSet;

	getId(): string;
}

export interface ITreeDataWithoutId {
	contentId: id;
	parentId: id;
	children: id[];
}

export interface ITreeDataFromDB {
	contentId: {
		val: string,
		mutations?
	};
	parentId: {
		val: string,
		mutations?
	};
	children: {
		val: IHash<boolean>,
		mutations?
	};
}

export interface ITreeData extends ITreeDataWithoutId {
	id: string;
}

export interface IAddContentInteractionMutationArgs {
	contentUserId;
	proficiency;
	timestamp;
}

export interface ICreateTreeMutationArgs {
	parentId: id;
	contentId: id;
	children?: id[];
}

export interface ICreateTreeLocationMutationArgs {
	treeId: id;
	x: number;
	y: number;
	level: number;
	mapId: id;
}

export interface ICreateMapMutationArgs {
	rootTreeId: id;
}

export interface ICreateMapAndRootTreeIdMutationArgs {
	contentId: id;
}

export interface ISwitchToMapMutationArgs {
	branchesMapId: id;
}

export interface ICreateUserOrLoginMutationArgs {
	userId: id;
	userInfo: firebase.UserInfo;
}

export interface ICreatePrimaryUserMapIfNotCreatedMutationArgs {
	userData: IUserData;
	user: ISyncableMutableSubscribableUser;
}

export interface ICreateUserPrimaryMapMutationArgs {
	userName: string;
}

export interface ILoadAndSwitchToMapMutationArgs {
	mapId: id;
}

export interface ILoadMapMutationArgs {
	branchesMapId: id;
}

export interface ILoadMapAndRootSigmaNodeMutationArgs {
	branchesMapId: id;
}

export interface ISaveUserInfoFromLoginProviderMutationArgs {
	userId: id;
	userInfo: firebase.UserInfo;
}

export interface ISetHoveringCardMutationArgs {
	sigmaId: id;
}
export interface IFlipCardMutationArgs {
	sigmaId: id;
}
export interface ISetEditingCardMutationArgs {
	sigmaId: id;
	contentId: id
}
export interface IEditCardTitleLocallyMutationArgs {
	title: string;
}
export interface ISetUserIdMutationArgs {
	userId: id;
}
export interface ISetCardOpenMutationArgs {
	sigmaId: id;
}

export type ICreateContentMutationArgs = IContentDataEither;

export interface ISubscribableTreeCore extends ITree {
	contentId: IMutableSubscribableField<string>;
	parentId: IMutableSubscribableField<string>;
	children: IMutableSubscribableStringSet;

	val(): ITreeDataWithoutId;
}

export interface IDbValable {
	dbVal();
}

export interface IValable {
	val();
}

export interface IValObject {
	val: any;
}

export enum TreePropertyNames {
	CONTENT_ID = 'CONTENT_ID',
	PARENT_ID = 'PARENT_ID',
	CHILDREN = 'CHILDREN',
}

export interface ISubscribableTree extends ISubscribable<IValUpdate>,
	ISubscribableTreeCore, IDescendantPublisher {
}

export interface IMutableSubscribableTree
	extends ISubscribableTree, IMutable<IProppedDatedMutation<TreePropertyMutationTypes, TreePropertyNames>> {
}

// treeUser

export interface ITreeUser {
	proficiencyStats: IMutableField<IProficiencyStats>;
	aggregationTimer: IMutableField<number>;
}

export interface ISubscribableTreeUserCore extends ITreeUser {
	proficiencyStats: IMutableSubscribableField<IProficiencyStats>;
	aggregationTimer: IMutableSubscribableField<number>;

	val(): ITreeUserData;
}

export enum TreeUserPropertyNames {
	PROFICIENCY_STATS = 'STATS',
	AGGREGATION_TIMER = 'AGGREGATION_TIMER',
}

export interface ISubscribableTreeUser extends ISubscribable<IValUpdate>, ISubscribableTreeUserCore, IDescendantPublisher {
}

export interface IMutableSubscribableTreeUser
	extends ISubscribableTreeUser,
		IMutable<IProppedDatedMutation<TreeUserPropertyMutationTypes, TreeUserPropertyNames>> {
}

export interface ITreeUserData {
	proficiencyStats: IProficiencyStats;
	aggregationTimer: number;
}

// treeLocation
export interface ITreeLocationData {
	point: ICoordinate;
	level: number;
	mapId: id;
}

export interface ITreeLocationDataFromFirebase {
	point: {
		val: ICoordinate
	};
	level: {
		val: number
	};
	mapId: {
		val: id
	};
}

export interface ITreeLocation {
	point: IUndoableMutablePoint;
	level: IMutableSubscribableField<number>;
	mapId: IMutableSubscribableField<id>;
}

export type id = any

export interface ISubscribableTreeLocationCore extends ITreeLocation {
	point: IMutableSubscribablePoint;
	level: IMutableSubscribableField<number>;
	mapId: IMutableSubscribableField<id>;

	val(): ITreeLocationData;
}

export enum TreeLocationPropertyNames {
	POINT = 'point',
	LEVEL = 'level',
	MAP_ID = 'mapId'
}

export interface ISubscribableTreeLocation extends ISubscribable<IValUpdate>, ISubscribableTreeLocationCore, IDescendantPublisher {
}

export interface IMutableSubscribableTreeLocation
	extends ISubscribableTreeLocation,
		IMutable<IProppedDatedMutation<TreeLocationPropertyMutationTypes, TreeLocationPropertyNames>> {
}

export interface ICreateUserOrLoginMutationArgs {

}

export interface IStartable {
	start();
}

// login
export interface IAuthListener extends IStartable {
}

// ui
export interface IUI extends ISubscriber<ITypeAndIdAndValUpdate> {
}

export type FGetStore = () => Store<any>;
// TODO: ^^ perhaps remove the above type and all its references

