import {injectable} from 'inversify';
import {IActivatableDatedMutation} from './IMutation';
// import {MutationTypes} from '.fromrom/MutationTypes';

@injectable()
class ActivatableDatedMutation<MutationTypes> implements IActivatableDatedMutation<MutationTypes> {
    public timestamp: number;
    public type: MutationTypes;
    public data;
    public active: boolean;
}

export {ActivatableDatedMutation}
