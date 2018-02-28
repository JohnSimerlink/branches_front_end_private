import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import {GLOBAL_ROOT_ID} from '../../core/globals';
import {getTreeIdFromUri} from './uriTreeMap';

test('uriTreeMap:::empty uri should return treeId GLOBAL_ROOT_ID', (t) => {
    expect(getTreeIdFromUri('')).to.equal(GLOBAL_ROOT_ID)
    t.pass()
})
