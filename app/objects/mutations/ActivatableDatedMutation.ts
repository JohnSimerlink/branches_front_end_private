import {injectable} from 'inversify';
import {IActivatableDatedMutation} from '../interfaces';

@injectable()
export class ActivatableDatedMutation<MutationTypes> implements IActivatableDatedMutation<MutationTypes> {
	public timestamp: number;
	public type: MutationTypes;
	public data;
	public active: boolean;
}
