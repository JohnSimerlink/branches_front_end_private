import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom();
import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {MutableSubscribableField} from '../field/MutableSubscribableField';
import {
    CONTENT_TYPES, BranchesMapPropertyNames, FieldMutationTypes, IDatedMutation,
    IProppedDatedMutation, ISyncableMutableSubscribableBranchesMap, timestamp
} from '../interfaces';
import {SubscribableMutableStringSet} from '../set/SubscribableMutableStringSet';
import {TYPES} from '../types';
import {MutableSubscribableBranchesMap} from './MutableSubscribableBranchesMap';
import {SyncableMutableSubscribableBranchesMap} from './SyncableMutableSubscribableBranchesMap';
myContainerLoadAllModules();
test('Sample BranchesMap test', (t) => {
    t.pass()
});
