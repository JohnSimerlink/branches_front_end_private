import test from 'ava'
import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import {injectionWorks} from '../../testHelpers/testHelpers';
import {ISampleComponentCreator} from '../../objects/interfaces';
import {myContainer} from '../../../inversify.config';
import {TYPES} from '../../objects/types';
import {expect} from 'chai'
import {SampleComponentCreatorArgs} from './sampleComponent';
test('Samplecomponent DI constructor should work', t => {
    const injects = injectionWorks<SampleComponentCreatorArgs, ISampleComponentCreator>({
        container: myContainer,
        argsType: TYPES.SampleComponentCreatorArgs,
        interfaceType: TYPES.ISampleComponentCreator,
    })
    expect(injects).to.equal(true)
    t.pass()
})
