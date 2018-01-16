import test from 'ava'
import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import {injectionWorks} from '../../testHelpers/testHelpers';
import {ISampleComponent} from '../../objects/interfaces';
import {myContainer} from '../../../inversify.config';
import {TYPES} from '../../objects/types';
import {expect} from 'chai'
import {SampleComponentArgs} from './sampleComponent';
test('Samplecomponent DI constructor should work', t => {
    const injects = injectionWorks<SampleComponentArgs, ISampleComponent>({
        container: myContainer,
        argsType: TYPES.SampleComponentArgs,
        interfaceType: TYPES.ISampleComponent,
    })
    expect(injects).to.equal(true)
    t.pass()
})
