import test from 'ava'
import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import {injectionWorks} from '../../testHelpers/testHelpers';
import {TreeComponentCreator2Args
    // , TreeComponentCreatorArgs
} from './tree';
import {IDBSubscriberToTreeLocation, ITreeComponentCreator, ITreeComponentCreator2} from '../../objects/interfaces';
import {myContainer} from '../../../inversify.config';
import {TYPES} from '../../objects/types';
import {expect} from 'chai'
import {DBSubscriberToTreeLocationArgs} from '../../objects/treeLocation/DBSubscriberToTreeLocation';
test('TreeComponentCreator::DI constructor should work', (t) => {
    // const injects = injectionWorks<DBSubscriberToTreeLocationArgs, IDBSubscriberToTreeLocation>({
    //     container: myContainer,
    //     argsType: TYPES.DBSubscriberToTreeLocationArgs,
    //     interfaceType: TYPES.IDBSubscriberToTreeLocation,
    // })
    const injects = injectionWorks<TreeComponentCreator2Args, ITreeComponentCreator2>({
        container: myContainer,
        argsType: TYPES.TreeComponentCreator2Args,
        interfaceType: TYPES.ITreeComponentCreator2,
    })
    // const injects = injectionWorks<TreeComponentCreatorArgs, ITreeComponentCreator>({
    //     container: myContainer,
    //     argsType: TYPES.TreeComponentCreatorArgs,
    //     interfaceType: TYPES.ITreeComponentCreator,
    // })
    expect(injects).to.equal(true)
    t.pass()
})
