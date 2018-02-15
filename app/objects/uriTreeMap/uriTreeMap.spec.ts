import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import {ROOT_ID} from '../../core/globals';
import {getTreeIdFromUri} from './uriTreeMap';

test('uriTreeMap:::empty uri should return treeId ROOT_ID', (t) => {
    expect(getTreeIdFromUri('')).to.equal(ROOT_ID)
    t.pass()
})
