import {expect} from 'chai'
import {ROOT_ID} from '../../core/globals';
import {getTreeIdFromUri} from './uriTreeMap';

describe('uriTreeMap', () => {
    it('empty uri should return treeId ROOT_ID', () => {
        expect(getTreeIdFromUri('')).to.equal(ROOT_ID)
    })
})
