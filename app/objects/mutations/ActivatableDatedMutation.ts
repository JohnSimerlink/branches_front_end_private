import {injectable} from 'inversify';
import {IActivatableDatedMutation} from './IMutation';
import {MutationTypes} from './MutationTypes';

@injectable()
class ActivatableDatedMutation implements IActivatableDatedMutation {
    public timestamp: number;
    public type: MutationTypes;
    public data;
    public active: boolean;
}

export {ActivatableDatedMutation}
