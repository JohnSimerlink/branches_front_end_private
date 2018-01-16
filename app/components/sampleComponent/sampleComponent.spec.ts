import test from 'ava'
import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import {injectionWorks} from '../../testHelpers/testHelpers';
import {ITree2ComponentCreator} from '../../objects/interfaces';
import {myContainer} from '../../../inversify.config';
import {TYPES} from '../../objects/types';
import {expect} from 'chai'
import {Tree2ComponentCreatorArgs} from './sampleComponent';
test('Samplecomponent DI constructor should work', t => {
    const injects = injectionWorks<Tree2ComponentCreatorArgs, ITree2ComponentCreator>({
        container: myContainer,
        argsType: TYPES.Tree2ComponentCreatorArgs,
        interfaceType: TYPES.ISampleComponentCreator,
    })
    expect(injects).to.equal(true)
    t.pass()
})
