import {injectFakeDom} from '../../testHelpers/injectFakeDom';

injectFakeDom();
import test from 'ava';
import {expect} from 'chai';
import * as sinon from 'sinon';
import {IRenderManager, ISigmaRenderManager} from '../interfaces';
import {TYPES} from '../types';
import {log} from '../../core/log';
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {TAGS} from '../tags';

myContainerLoadAllModules({fakeSigma: true});
test('RenderManager::::subscribe should add RenderManagerCore.addNodeToRenderList' +
	' to obj\'s callback list', (t) => {
	// log('html element is', HTMLElement)
	// expect(sample('5')).to.equal(false)
	// t.pass()
	const subscribable = myContainer.getTagged<ISigmaRenderManager>(
		TYPES.ISigmaRenderManager, TAGS.MAIN_SIGMA_INSTANCE, true
	);
	const renderedNodesManager: IRenderManager
		= myContainer.get<IRenderManager>(TYPES.IRenderManager);
	const subscribableOnUpdateSpy = sinon.spy(subscribable, 'onUpdate');
	renderedNodesManager.subscribe(subscribable);
	expect(subscribableOnUpdateSpy.callCount).to.equal(1);
	t.pass();
});
// globalAny.cleanup()
