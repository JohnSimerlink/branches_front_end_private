import {myContainer} from '../../../inversify.config';
import {ISubscribableBasicTree} from '../tree/ISubscribableBasicTree';
import {TYPES} from '../types';

describe('SubscribableTreeDataStore', () => {
    it('An update in a member tree should be published to a subscriber of the tree data store', () => {
        const tree = myContainer.get<ISubscribableBasicTree>(TYPES.ISubscribableBasicTree)
    })
})
