import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom();
import test from 'ava'
import {expect} from 'chai'
import 'reflect-metadata'
import {stringArrayToSet} from '../../core/newUtils';
import {MutableSubscribableField} from '../../objects/field/MutableSubscribableField';
import {
    IHash, IMutableSubscribableTreeUser, IProficiencyStats, ITreeUser, ITreeUserData,
} from '../../objects/interfaces';
import {SubscribableMutableStringSet} from '../../objects/set/SubscribableMutableStringSet';
import {MutableSubscribableTreeUser} from '../../objects/treeUser/MutableSubscribableTreeUser';
import {TreeUserDeserializer} from './TreeUserDeserializer';
import {myContainerLoadAllModules} from '../../../inversify.config';
import {SyncableMutableSubscribableTreeUser} from '../../objects/treeUser/SyncableMutableSubscribableTreeUser';

myContainerLoadAllModules();
test('TreeUserDeserializer::: deserializeFromDB Should deserializeFromDB properly', (t) => {
    const proficiencyStatsVal = {
        ONE: 3,
    } as IProficiencyStats;
    const aggregationTimerVal = 87;

    const treeUserData: ITreeUserData = {
        proficiencyStats: proficiencyStatsVal,
        aggregationTimer: aggregationTimerVal,
    };
    const treeUserId = '092384';

    const proficiencyStats = new MutableSubscribableField<IProficiencyStats>({field: proficiencyStatsVal});
    const aggregationTimer = new MutableSubscribableField<number>({field: aggregationTimerVal});
    const expectedTreeUser: IMutableSubscribableTreeUser = new SyncableMutableSubscribableTreeUser(
        {updatesCallbacks: [], proficiencyStats, aggregationTimer}
    );
    const deserializedTreeUser: IMutableSubscribableTreeUser
        = TreeUserDeserializer.deserialize({treeUserData, treeUserId});
    expect(deserializedTreeUser).to.deep.equal(expectedTreeUser);
    t.pass()
});
