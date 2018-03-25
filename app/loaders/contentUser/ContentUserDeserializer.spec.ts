import test from 'ava';
import {expect} from 'chai';
import 'reflect-metadata';
import {IMutableSubscribableContentUser} from '../../objects/interfaces';
import {ContentUserDeserializer} from './ContentUserDeserializer';
import {myContainerLoadAllModules, myContainerLoadLoaders} from '../../../inversify.config';
import {
    getASampleContentUser1, sampleContentUser1Id,
    sampleContentUserData1
} from '../../objects/contentUser/contentUserTestHelpers';

myContainerLoadLoaders();
test('ContentUserDeserializer::: deserializeFromDB Should deserializeFromDB properly', (t) => {
    const deserializedContentUser: IMutableSubscribableContentUser
        = ContentUserDeserializer.deserialize({id: sampleContentUser1Id, contentUserData: sampleContentUserData1});
    expect(deserializedContentUser).to.deep.equal(getASampleContentUser1());
    t.pass();
});
