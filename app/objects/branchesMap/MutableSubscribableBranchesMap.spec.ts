import {injectFakeDom} from '../../testHelpers/injectFakeDom';
import test from 'ava'
import {expect} from 'chai'
import {myContainerLoadAllModules} from '../../../inversify.config';

injectFakeDom();
myContainerLoadAllModules({fakeSigma: true});
test('Sample BranchesMap test', (t) => {
    t.pass();
});
