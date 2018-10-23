import test from 'ava';
import {getUserId} from './ContentUserLoaderUtils';
import {expect} from 'chai';
import {myContainerLoadAllModules} from '../../../inversify.config';
import {COMBINED_ID_SEPARATOR} from '../../core/globals';

myContainerLoadAllModules({fakeSigma: true});
test('getUserId', t => {
	const contentId = '431';
	const userId = 'ab987';
	const contentUserId = contentId + COMBINED_ID_SEPARATOR + userId;

	const calculatedUserId = getUserId({contentUserId});
	expect(calculatedUserId).to.deep.equal(userId);
	t.pass();
});
