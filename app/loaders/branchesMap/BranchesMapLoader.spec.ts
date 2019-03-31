import test
	from 'ava';
import {expect} from 'chai';
import {MockFirebase} from 'firebase-mock';
import {
	myContainer,
	myContainerLoadAllModules
} from '../../../inversify.config';
import {IBranchesMapLoader} from '../../objects/interfaces';
import {TYPES} from '../../objects/types';
import {injectionWorks} from '../../testHelpers/testHelpers';
import {BranchesMapLoaderArgs} from './BranchesMapLoader';

myContainerLoadAllModules({fakeSigma: true});
test('BranchesMapLoader:::DI constructor should work', (t) => {
	const injects = injectionWorks<BranchesMapLoaderArgs, IBranchesMapLoader>({
		container: myContainer,
		argsType: TYPES.BranchesMapLoaderArgs,
		interfaceType: TYPES.IBranchesMapLoader,
	});
	expect(injects).to.equal(true);
	t.pass();
});
