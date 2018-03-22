import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom();
import test from 'ava';
import {expect} from 'chai';
import {myContainerLoadAllModules} from '../../../inversify.config';

myContainerLoadAllModules({fakeSigma: true});
test('Sample BranchesMap test', (t) => {
    t.pass();
});
