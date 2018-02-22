export const TYPES = {
    Any: Symbol('Any'),
    AppContainer: Symbol('AppContainer'),
    AppContainerArgs: Symbol('AppContainerArgs'),
    AppArgs: Symbol('AppArgs'),
    Array: Symbol('Array'),
    AutoSaveMutableSubscribableContentStoreArgs: Symbol('AutoSaveMutableSubscribableContentStoreArgs'),
    AutoSaveMutableSubscribableContentUserStoreArgs: Symbol('AutoSaveMutableSubscribableContentUserStoreArgs'),
    AutoSaveMutableSubscribableTreeStoreArgs: Symbol('AutoSaveMutableSubscribableTreeStoreArgs'),
    AutoSaveMutableSubscribableTreeLocationStoreArgs: Symbol('AutoSaveMutableSubscribableTreeLocationStoreArgs'),
    AutoSaveMutableSubscribableTreeUserStoreArgs: Symbol('AutoSaveMutableSubscribableTreeUserStoreArgs'),
    AuthListenerArgs: Symbol('AuthListenerArgs'),
    Boolean: Symbol('Boolean'),
    BranchesStore: Symbol('BranchesStore'),
    BranchesStoreState: Symbol('BranchesStoreState'),
    BranchesStoreArgs: Symbol('BranchesStoreArgs'),
    ContentUserDataArgs: Symbol('ContentUserDataArgs'),
    ContentLoaderArgs: Symbol('ContentLoaderArgs'),
    ContentLoaderAndAutoSaverArgs: Symbol('ContentLoaderAndAutoSaverArgs'),
    ContentUserLoaderArgs: Symbol('ContentUserLoaderArgs'),
    ContentUserLoaderAndAutoSaverArgs: Symbol('ContentUserLoaderAndAutoSaverArgs'),
    CanvasUI: Symbol('CanvasUI'),
    CanvasUIArgs: Symbol('CanvasUIArgs'),
    DBSubscriberToTreeArgs: Symbol('DBSubscriberToTreeArgs'),
    DBSubscriberToTreeUserArgs: Symbol('DBSubscriberToTreeUserArgs'),
    DBSubscriberToTreeLocationArgs: Symbol('DBSubscriberToTreeLocationArgs'),
    FamilyLoaderArgs: Symbol('FamilyLoaderArgs'),
    FamilyLoaderCoreArgs: Symbol('FamilyLoaderCoreArgs'),
    FirebaseReference: Symbol('Reference'),
    FirebaseSyncerArgs: Symbol('PropertyAutoFirebaseSaverArgs'),
    Function: Symbol('Function'),
    IActivatableDatedMutation: Symbol('IActivatableDatedMutation'),
    IActivatableDatedMutationArr: Symbol('IActivatableDatedMutationArr'),
    IApp: Symbol('IApp'),
    IAuthListener: Symbol('IAuthListener'),
    IAutoSaveMutableSubscribableContentUserStore: Symbol('IAutoSaveMutableSubscribableContentUserStore'),
    ICanvasUI: Symbol('ICanvasUI'),
    IColorSlice: Symbol('IColorSlice'),
    IContentIdSigmaIdMap: Symbol('IContentIdSigmaIdMap'),
    IContentLoader: Symbol('IContentLoader'),
    IContentUserLoader: Symbol('IContentUserLoader'),
    IContentUserData: Symbol('IContentUserData'),
    Id: Symbol('Id'),
    IDatedSetMutation: Symbol('IDatedSetMutation'),
    IDatabaseAutoSaver: Symbol('IDatabaseAutoSaver'),
    IDBSubscriber: Symbol('IDBSubscriber'),
    IDBSubscriberToTreeLocation: Symbol('IDBSubscriberToTreeLocation'),
    IDBSubscriberToTree: Symbol('IDBSubscriberToTree'),
    IDatedMutation: Symbol('IDatedMutation'),
    IFamilyLoader: Symbol('IFamilyLoader'),
    IFamilyLoaderCore: Symbol('IFamilyLoaderCore'),
    IKnawledgeMapCreator: Symbol('IVueComponentCreator'),
    IKnawledgeMapCreatorClone: Symbol('IKnawledgeMapCreatorClone'),
    IManagedSigmaNodeCreatorCore: Symbol('IManagedSigmaNodeCreatorCore'),
    IMutableId: Symbol('IMutableField'),
    IMutableStringSet: Symbol('IMutableStringSet'),
    IMutableSubscribableTree: Symbol('IMutableSubscribableTree'),
    IMutableSubscribableTreeStore: Symbol('IMutableSubscribableTreeStore'),
    IMutableSubscribableTreeUserStore: Symbol('IMutableSubscribableTreeUserStore'),
    IMutableSubscribableTreeUser: Symbol('IMutableSubscribableTreeUser'),
    IMutableSubscribableTreeLocation: Symbol('IMutableSubscribableTreeLocation'),
    IMutableSubscribableTreeLocationStore: Symbol('IMutableSubscribableTreeLocationStore'),
    IMutableSubscribableContent: Symbol('IMutableSubscribableContent'),
    IMutableSubscribableContentUser: Symbol('IMutableSubscribableContentUser'),
    IMutableSubscribableContentUserStore: Symbol('IMutableSubscribableContentUserStore'),
    IMutableSubscribableContentStore: Symbol('IMutableSubscribableContentStore'),
    IMutableSubscribableGlobalStore: Symbol('IMutableSubscribableGlobalStore'),
    INewTreeComponentCreator: ('INewTreeComponentCreator'),
    IOverdueListener: Symbol('IOverdueListener'),
    IOverdueListenerCore: Symbol('IOverdueListenerCore'),
    IOneToManyMap: Symbol('IOneToManyMap'),
    IProficiencyStats: Symbol('IProficiencyStats'),
    IProppedDatedMutation: Symbol('IProppedDatedMutation'),
    IRenderedNodesManager: Symbol('IRenderManager'),
    IRenderManagerCore: Symbol('IRenderManagerCore'),
    ISaveUpdatesToDBFunction: Symbol('ISaveUpdatesToDBFunction'),
    ISampleComponentCreator: Symbol('ITree2ComponentCreator'),
    ISigma: Symbol('ISigma'),
    ISigmaEdge: Symbol('ISigmaEdge'),
    ISigmaEdges: Symbol('ISigmaEdges'),
    ISigmaEdgesUpdater: Symbol('ISigmaEdgesUpdater'),
    ISigmaNode: Symbol('ISigmaNode'),
    ISigmaNodeCreator: Symbol('ISigmaNodeCreator'),
    ISigmaNodeCreatorCore: Symbol('ISigmaNodeCreatorCore'),
    ISigmaNodeCreatorCaller: Symbol('IStoreSourceUpdateListener'),
    ISigmaNodeData: Symbol('ISigmaNodeData'),
    ISigmaNodes: Symbol('ISigmaNodes'),
    ISigmaNodeLoader: Symbol('ISigmaNodeLoader'),
    ISigmaNodeLoaderCore: Symbol('ISigmaNodeLoaderCore'),
    ISigmaNodesUpdater: Symbol('ISigmaNodesUpdater'),
    ISigmaRenderManager: Symbol('ISigmaRenderManager'),
    ISigmaUpdater: Symbol('ISigmaUpdater'),
    ISpecialTreeLoader: Symbol('ISpecialTreeLoader'),
    IStoreSourceUpdateListener: Symbol('IStoreSourceUpdateListener'),
    IStoreSourceUpdateListenerCore: Symbol('IStoreSourceUpdateListenerCore'),
    ISubscribableContent: Symbol('ISubscribableContent'),
    ISubscribableContentStore: Symbol('ISubscribableContentStore'),
    ISubscribableContentStoreSource: Symbol('ISubscribableContentStoreSource'),
    ISubscribableContentUser: Symbol('ISubscribableContentUser'),
    ISubscribableContentUserStore: Symbol('ISubscribableContentUserStore'),
    ISubscribableContentUserStoreSource: Symbol('ISubscribableContentUserStoreSource'),
    ISubscribableGlobalStore: Symbol('ISubscribableGlobalStore'),
    ISubscribableMutableBoolean: Symbol('ISubscribableMutableBoolean'),
    ISubscribableMutableNumber: Symbol('ISubscribableMutableNumber'),
    ISubscribableMutableContentType: Symbol('ISubscribableMutableContentType'),
    ISubscribableMutableProficiency: Symbol('ISubscribableMutableProficiency'),
    ISubscribableMutableProficiencyStats: Symbol('ISubscribableMutableProficiencyStats'),
    ISubscribableMutableString: Symbol('ISubscribableMutableString'),
    ISubscribableMutableStringSet: Symbol('ISubscribableMutableStringSet'),
    ISubscribableStore_ISubscribableTreeCore: Symbol('ISubscribableStore_ISubscribableTreeCore'),
    ISubscribableTree: Symbol('ISubscribableTreeCore'),
    ISubscribableTreeStoreSource: Symbol('ISubscribableTreeStoreSource'),
    ISubscribableTreeLocation: Symbol('ISubscribableTreeLocation'),
    ISubscribableTreeLocationStore: Symbol('ISubscribableTreeLocationStore'),
    ISubscribableTreeLocationStoreSource: Symbol('ISubscribableTreeLocationStoreSource'),
    ISubscribableTreeUser: Symbol('ISubscribableTreeUser'),
    ISubscribableTreeUserStore: Symbol('ISubscribableTreeUserStore'),
    ISubscribableTreeUserStoreSource: Symbol('ISubscribableTreeUserStoreSource'),
    ISubscribableTreeStore: Symbol('ISubscribableTreeStore'),
    IMutableSubscribablePoint: Symbol('IMutableSubscribablePoint'),
    ISubscriber_ITypeAndIdAndValUpdates_Array: Symbol('ISubscriber_ITypeAndIdAndValUpdates_Array'),
    ISyncableValableObject: Symbol('ISyncableValableObject'),
    ISyncableMutableSubscribableContent: Symbol('ISyncableMutableSubscribableContent'),
    ISyncableMutableSubscribableContentUser: Symbol('ISyncableMutableSubscribableContentUser'),
    ISyncableMutableSubscribableTree: Symbol('ISyncableMutableSubscribableTree'),
    ISyncableMutableSubscribableTreeUser: Symbol('ISyncableMutableSubscribableTreeUser'),
    ISyncableMutableSubscribableTreeLocation: Symbol('ISyncableMutableSubscribableTreeLocation'),
    ITooltipOpener: Symbol('ITooltipOpener'),
    ITooltipRenderer: Symbol('ITooltipRenderer'),
    ITooltipRendererFunction: Symbol('ITooltipRendererFunction'),
    ITree: Symbol('ITree'),
    ITree2ComponentCreator: Symbol('ITree2ComponentCreator'),
    ITree3Creator: Symbol('ITree3Creator'),
    ITree3CreatorClone: Symbol('ITree3Creator'),
    ITreeComponentCreator: Symbol('ITreeComponentCreator'),
    ITreeComponentCreator2: Symbol('ITreeComponentCreator2'),
    ITreeLoader: Symbol('ITreeLoader'),
    ITreeLocation: Symbol('ITreeLocation'),
    ITreeLocationLoader: Symbol('ITreeLocationLoader'),
    ITreeUser: Symbol('ITree'),
    ITreeUserLoader: Symbol('ITreeUserLoader'),
    IVueConfigurer: Symbol('IVueConfigurer'),
    IUserLoader: Symbol('IUserLoader'),
    IUserUtils: Symbol('IUserUtils'),
    IVuexStore: Symbol('IVuexStore'),
    KnawledgeMapCreator: Symbol('KnawledgeMapCreator'),
    KnawledgeMapCreatorClone: Symbol('Tree3Creator'),
    KnawledgeMapCreatorArgs: Symbol('KnawledgeMapCreatorArgs'),
    ManagedSigmaNodeCreatorCoreArgs: Symbol('ManagedSigmaNodeCreatorCoreArgs'),
    MutableSubscribablePointArgs: Symbol('MutableSubscribablePointArgs'),
    MutableSubscribableGlobalStoreArgs: Symbol('MutableSubscribableGlobalStoreArgs'),
    NewTreeComponentCreatorArgs: Symbol('NewTreeComponentCreatorArgs'),
    Number: Symbol('Number'),
    Object: Symbol('Object'),
    ObjectFirebaseAutoSaverArgs: Symbol('ObjectFirebaseAutoSaverArgs'),
    OverdueListenerArgs: Symbol('OverdueListenerArgs'),
    ObjectDataTypes: Symbol('ObjectDataTypes'),
    OneToManyMapArgs: Symbol('OneToManyMapArgs'),
    PropertyFirebaseSaverArgs: Symbol('PropertyFirebaseSaverArgs'),
    PROFICIENCIES: Symbol('PROFICIENCIES'),
    RenderedNodesManagerArgs: Symbol('RenderManagerArgs'),
    RenderedNodesManagerCoreArgs: Symbol('RenderManagerCoreArgs'),
    Tree2ComponentCreatorArgs: Symbol('Tree2ComponentCreatorArgs'),
    Tree3CreatorArgs: Symbol('Tree3CreatorArgs'),
    Sigma: Symbol('Sigma'),
    SigmaConfigs: Symbol('SigmaConfigs'),
    SigmaEventListenerArgs: Symbol('SigmaEventListenerArgs'),
    SigmaEventListener: Symbol('SigmaEventListener'),
    SigmaEdgesUpdaterArgs: Symbol('SigmaEdgesUpdaterArgs'),
    SigmaNodeArgs: Symbol('SigmaNodeArgs'),
    SigmaNodeCreatorCoreArgs: Symbol('SigmaNodeCreatorCoreArgs'),
    SigmaNodeCreatorArgs: Symbol('SigmaNodeCreatorArgs'),
    SigmaNodeLoaderArgs: Symbol('SigmaNodeLoaderArgs'),
    SigmaNodeLoaderCoreArgs: Symbol('SigmaNodeLoaderCoreArgs'),
    SigmaNodesUpdaterArgs: Symbol('SigmaNodesUpdaterArgs'),
    SigmaRenderManager: Symbol('SigmaRenderManager'),
    SigmaRenderManagerArgs: Symbol('SigmaRenderManagerArgs'),
    SigmaUpdaterArgs: Symbol('SigmaUpdaterArgs'),
    SpecialTreeLoaderArgs: Symbol('SpecialTreeLoaderArgs'),
    String: Symbol('String'),
    StringNotEmpty: Symbol('StringNotEmpty'),
    StoreSourceUpdateListenerArgs: Symbol('StoreSourceUpdateListenerArgs'),
    StoreSourceUpdateListenerCoreArgs: Symbol('StoreSourceUpdateListenerCoreArgs'),
    Subscribable: Symbol('Subscribable'),
    SubscribableArgs: Symbol('SubscribableArgs'),
    SubscribableContentArgs: Symbol('SubscribableContentArgs'),
    SubscribableContentStoreArgs: Symbol('SubscribableContentStoreArgs'),
    SubscribableContentStoreSourceArgs: Symbol('SubscribableContentStoreSourceArgs'),
    SubscribableContentUserArgs: Symbol('SubscribableContentUserArgs'),
    SubscribableContentUserStoreArgs: Symbol('SubscribableContentUserStoreArgs'),
    SubscribableContentUserStoreSourceArgs: Symbol('SubscribableContentUserStoreSourceArgs'),
    SubscribableStoreArgs: Symbol('SubscribableStoreArgs'),
    SubscribableStoreSourceArgs: Symbol('SubscribableStoreSourceArgs'),
    SubscribableGlobalStoreArgs: Symbol('SubscribableGlobalStoreArgs'),
    MutableSubscribableFieldArgs: Symbol('ISubscribableMutableFieldArgs'),
    SubscribableMutableStringSetArgs: Symbol('SubscribableMutableStringSetArgs'),
    SubscribableTreeArgs: Symbol('SubscribableTreeArgs'),
    SubscribableTreeStoreArgs: Symbol('SubscribableTreeStoreArgs'),
    SubscribableTreeUserArgs: Symbol('SubscribableTreeUserArgs'),
    SubscribableTreeUserStoreArgs: Symbol('SubscribableTreeUserStoreArgs'),
    SubscribableTreeUserStoreSourceArgs: Symbol('SubscribableTreeUserStoreSourceArgs'),
    SubscribableTreeLocationArgs: Symbol('SubscribableTreeLocationArgs'),
    SubscribableTreeLocationStoreArgs: Symbol('SubscribableTreeLocationStoreArgs'),
    SubscribableTreeLocationStoreSourceArgs: Symbol('SubscribableTreeLocationStoreSourceArgs'),
    SubscribableTreeStoreSourceArgs: Symbol('SubscribableTreeStoreSourceArgs'),
    SubscribableUserArgs: Symbol('SubscribableUserArgs'),
    PropertyAutoFirebaseSaverArgs: Symbol('PropertyAutoFirebaseSaverArgs'),
    SyncToFirebaseArgs: Symbol('PropertyAutoFirebaseSaverArgs'),
    TooltipOpenerArgs: Symbol('TooltipOpenerArgs'),
    TooltipRendererArgs: Symbol('TooltipRendererArgs'),
    TreeComponentCreatorArgs: Symbol('TreeComponentCreatorArgs'),
    TreeComponentCreator2Args: Symbol('TreeComponentCreator2Args'),
    TreeLoaderAndAutoSaverArgs: Symbol('TreeLoaderAndAutoSaverArgs'),
    TreeLoaderArgs: Symbol('TreeLoaderArgs'),
    TreeLocationLoaderArgs: Symbol('TreeLocationLoaderArgs'),
    TreeLocationLoaderAndAutoSaverArgs: Symbol('TreeLocationLoaderAndAutoSaverArgs'),
    TreeUserLoaderArgs: Symbol('TreeUserLoaderArgs'),
    UserLoaderArgs: Symbol('UserLoaderArgs'),
    UserLoaderAndAutoSaverArgs: Symbol('UserLoaderAndAutoSaverArgs'),
    UserUtilsArgs: Symbol('UserUtilsArgs'),
    UIColor: Symbol('UIColor'),
    VueConfigurerArgs: Symbol('VueConfigurerArgs'),
    fGetSigmaIdsForContentId: Symbol('fGetSigmaIdsForContentId'),
    radian: Symbol('radian'),
}
