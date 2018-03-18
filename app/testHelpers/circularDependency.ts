import {injectFakeDom} from './injectFakeDom';
injectFakeDom();

import {myContainer, myContainerLoadAllModules} from '../../inversify.config';
import {TYPES} from '../objects/types';
import {CanvasUI, CanvasUIArgs} from '../objects/sigmaNode/CanvasUI';
import {IMutableSubscribableGlobalStore, ISigmaNodesUpdater} from '../objects/interfaces';
import {SigmaNodesUpdaterArgs} from '../objects/sigmaNode/SigmaNodesUpdater';
import BranchesStore, {BranchesStoreArgs} from '../core/store/store';
import {MutableSubscribableGlobalStoreArgs} from '../objects/stores/MutableSubscribableGlobalStore';

myContainerLoadAllModules({fakeSigma: true})
const canvasUI = myContainer.get<CanvasUI>(TYPES.CanvasUI);
// const canvasUI = myContainer.get<CanvasUIArgs>(TYPES.CanvasUIArgs);
// const sigmaNodesUpdater = myContainer.get<SigmaNodesUpdaterArgs>(TYPES.SigmaNodesUpdaterArgs);

// const branchesStore = myContainer.get<BranchesStore>(TYPES.BranchesStore);
// const branchesStore = myContainer.get<BranchesStoreArgs>(TYPES.BranchesStoreArgs);
// const globalStore = myContainer.get<IMutableSubscribableGlobalStore>(TYPES.IMutableSubscribableGlobalStore);
// const globalStoreArgs = myContainer.get<MutableSubscribableGlobalStoreArgs>(TYPES.MutableSubscribableGlobalStoreArgs);
