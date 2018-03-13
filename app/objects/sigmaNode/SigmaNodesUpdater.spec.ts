// tslint:disable object-literal-sort-keys
import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom();
import {expect} from 'chai'
import * as sinon from 'sinon'
import {log} from '../../../app/core/log'
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {CONTENT_TYPES, ISigmaNodesUpdater, ISigmaRenderManager, ITreeLocationData} from '../interfaces';
import {CustomStoreDataTypes} from '../interfaces';
import {ITypeAndIdAndValUpdate} from '../interfaces';
import {
    IContentData, IContentUserData, ICoordinate,
    ISigmaNode, ITreeDataWithoutId, ITreeUserData
} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {TYPES} from '../types';
import {SigmaNodesUpdater, SigmaNodesUpdaterArgs} from './SigmaNodesUpdater';

import test from 'ava'
import {
    CONTENT_ID, getSigmaIdsForContentId, SIGMA_ID1, SIGMA_ID2, TREE_ID,
    TREE_ID2
} from '../../testHelpers/testHelpers';
import {getContentUserId} from '../../loaders/contentUser/ContentUserLoaderUtils';
import {partialInject} from '../../testHelpers/partialInject';
import {sampleTreeLocationData1} from "../treeLocation/treeLocationTestHelpers";
import {sampleTreeUserData1} from "../treeUser/treeUsertestHelpers";
import {sampleContentData1} from "../content/contentTestHelpers";
import {sampleContentUserData1} from "../contentUser/ContentUserHelpers";
import {sampleTreeData1} from "../tree/treeTestHelpers";
function refresh() {}
myContainerLoadAllModules({fakeSigma: true});

let sigmaNodes;
let sigmaNode1;
let sigmaNode2;

let sigmaNodesUpdater: ISigmaNodesUpdater;
let sigmaRenderManager: ISigmaRenderManager;
test.beforeEach('init sigmaNodes', () => {
    sigmaNode1 = myContainer.get<ISigmaNode>(TYPES.ISigmaNode);
    sigmaNode2 = myContainer.get<ISigmaNode>(TYPES.ISigmaNode);
    sigmaNodes = {};
    sigmaNodes[SIGMA_ID1] = sigmaNode1;
    sigmaNodes[SIGMA_ID2] = sigmaNode2;
    sigmaRenderManager = myContainer.get<ISigmaRenderManager>(TYPES.ISigmaRenderManager);

    sigmaNodesUpdater = partialInject<SigmaNodesUpdaterArgs>({
        konstructor: SigmaNodesUpdater,
        constructorArgsType: TYPES.SigmaNodesUpdaterArgs,
        injections: {
            getSigmaIdsForContentId,
            sigmaRenderManager,
        },
        container: myContainer
    })
    // sigmaNodesUpdater = new SigmaNodesUpdater(
    //     {
    //         sigmaNodes,
    //         getSigmaIdsForContentId,
    //         sigmaRenderManager,
    //         refresh,
    //         contentIdContentMap: {}
    //     }
    // )
});
//
test('SigmaNodesUpdater:::A Tree Update should call the correct method' +
    ' on the sigma Node with the correct args', (t) => {
    const newContentId = '4324234';
    const newParentId = '4344324234';
    const newChildren = ['45344324234', 'aabc321', 'abcd43132'];
    const val: ITreeDataWithoutId = {
        children: newChildren,
        contentId: newContentId,
        parentId: newParentId,
    };
    const update: ITypeAndIdAndValUpdate = {
        id: TREE_ID,
        type: CustomStoreDataTypes.TREE_DATA,
        val,
    };
    const sigmaNode1ReceiveNewTreeDataSpy = sinon.spy(sigmaNode1, 'receiveNewTreeData');
    const sigmaNode2ReceiveNewTreeDataSpy = sinon.spy(sigmaNode2, 'receiveNewTreeData');
    // TODO: make one unit for testing that updateSigmaNode gets called correctly twice
    // (and with the correct params ?). . .and make another unit for testing that updateSigmaNode behaves correctly

    sigmaNodesUpdater.handleUpdate(update);
    expect(sigmaNode1ReceiveNewTreeDataSpy.callCount).to.equal(1);
    expect(sigmaNode1ReceiveNewTreeDataSpy.getCall(0).args[0]).to.deep.equal(val);
    expect(sigmaNode2ReceiveNewTreeDataSpy.callCount).to.equal(0);
    t.pass()
});
//
test('SigmaNodesUpdater:::A Tree Location Update should call' +
    ' the correct method on the sigma Node with the correct args', (t) => {
    const update: ITypeAndIdAndValUpdate = {
        id: TREE_ID,
        type: CustomStoreDataTypes.TREE_LOCATION_DATA,
        val: sampleTreeLocationData1,
    };

    const sigmaNode1ReceiveNewTreeLocationDataSpy = sinon.spy(sigmaNode1, 'receiveNewTreeLocationData');
    const sigmaNode2ReceiveNewTreeLocationDataSpy = sinon.spy(sigmaNode2, 'receiveNewTreeLocationData');

    sigmaNodesUpdater.handleUpdate(update);
    expect(sigmaNode1ReceiveNewTreeLocationDataSpy.getCall(0).args[0]).to.deep.equal(sampleTreeLocationData1);
    expect(sigmaNode1ReceiveNewTreeLocationDataSpy.callCount).to.equal(1);
    expect(sigmaNode2ReceiveNewTreeLocationDataSpy.callCount).to.equal(0);
    t.pass()
});
//
test('SigmaNodesUpdater:::A Tree User Data Update should call' +
    ' the correct method on the sigma Node with the correct args', (t) => {
    // TODO: make ITypeandIdAndValUpdates a generic that takes the type, so that we can have type safety on val
    const update: ITypeAndIdAndValUpdate = {
        id: TREE_ID,
        type: CustomStoreDataTypes.TREE_USER_DATA,
        val: sampleTreeUserData1,
    };
    const sigmaNode1ReceiveNewTreeUserDataSpy = sinon.spy(sigmaNode1, 'receiveNewTreeUserData');
    const sigmaNode2ReceiveNewTreeUserDataSpy = sinon.spy(sigmaNode2, 'receiveNewTreeUserData');

    sigmaNodesUpdater.handleUpdate(update);
    expect(sigmaNode1ReceiveNewTreeUserDataSpy.getCall(0).args[0]).to.deep.equal(sampleTreeUserData1);
    expect(sigmaNode1ReceiveNewTreeUserDataSpy.callCount).to.equal(1);
    expect(sigmaNode2ReceiveNewTreeUserDataSpy.callCount).to.equal(0);
    t.pass()
});
//
test('SigmaNodesUpdater:::A Content Update should call the correct method' +
    ' on the sigma Node with the correct args', (t) => {
    // TODO: make ITypeandIdAndValUpdates a generic that takes the type, so that we can have type safety on val
    const update: ITypeAndIdAndValUpdate = {
        id: CONTENT_ID,
        type: CustomStoreDataTypes.CONTENT_DATA,
        val: sampleContentData1,
    };
    const sigmaNode1ReceiveNewContentDataSpy = sinon.spy(sigmaNode1, 'receiveNewContentData');
    const sigmaNode2ReceiveNewContentDataSpy = sinon.spy(sigmaNode2, 'receiveNewContentData');

    sigmaNodesUpdater.handleUpdate(update);
    expect(sigmaNode1ReceiveNewContentDataSpy.getCall(0).args[0]).to.deep.equal(sampleContentData1);
    expect(sigmaNode2ReceiveNewContentDataSpy.getCall(0).args[0]).to.deep.equal(sampleContentData1);
    t.pass()
});
//
test('SigmaNodesUpdater:::A Content User Update should call the correct method' +
    ' on the sigma Node with the correct args', (t) => {
    // TODO: make ITypeandIdAndValUpdates a generic that takes the type, so that we can have type safety on val
    const update: ITypeAndIdAndValUpdate = {
        id: CONTENT_ID,
        type: CustomStoreDataTypes.CONTENT_USER_DATA,
        val: sampleContentUserData1,
    };
    const sigmaNode1ReceiveNewContentUserDataSpy = sinon.spy(sigmaNode1, 'receiveNewContentUserData');
    const sigmaNode2ReceiveNewContentUserDataSpy = sinon.spy(sigmaNode2, 'receiveNewContentUserData');

    sigmaNodesUpdater.handleUpdate(update);
    expect(sigmaNode1ReceiveNewContentUserDataSpy.getCall(0).args[0]).to.deep.equal(sampleContentUserData1);
    expect(sigmaNode2ReceiveNewContentUserDataSpy.getCall(0).args[0]).to.deep.equal(sampleContentUserData1);
    t.pass()
});

test('SigmaNodesUpdater:::A receive tree data and receive tree location data should call the appropriate methods' +
    ' on sigmaRenderManager place the node into the rendered nodes list', (t) => {
    const treeDataUpdate: ITypeAndIdAndValUpdate = {
        id: TREE_ID,
        type: CustomStoreDataTypes.TREE_DATA,
        val: sampleTreeData1,
    };

    const treeLocationDataUpdate: ITypeAndIdAndValUpdate = {
        id: TREE_ID,
        type: CustomStoreDataTypes.TREE_LOCATION_DATA,
        val: sampleTreeLocationData1,
    };

    const sigmaRenderManagerMarkTreeDataLoadedSpy = sinon.spy(sigmaRenderManager, 'markTreeDataLoaded');
    const sigmaRenderManagerMarkTreeLocationDataLoadedSpy = sinon.spy
    (sigmaRenderManager, 'markTreeLocationDataLoaded');

    expect(sigmaRenderManagerMarkTreeDataLoadedSpy.callCount).to.equal(0);
    expect(sigmaRenderManagerMarkTreeLocationDataLoadedSpy.callCount).to.equal(0);
    sigmaNodesUpdater.handleUpdate(treeDataUpdate);
    expect(sigmaRenderManagerMarkTreeDataLoadedSpy.callCount).to.equal(1);
    expect(sigmaRenderManagerMarkTreeLocationDataLoadedSpy.callCount).to.equal(0);
    sigmaNodesUpdater.handleUpdate(treeLocationDataUpdate);
    expect(sigmaRenderManagerMarkTreeLocationDataLoadedSpy.callCount).to.equal(1);
    expect(sigmaRenderManagerMarkTreeDataLoadedSpy.callCount).to.equal(1);
    t.pass()
});
