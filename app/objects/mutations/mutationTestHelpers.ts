import {TREE_ID3} from '../../testHelpers/testHelpers';
import {
	FieldMutationTypes,
	IDatedMutation,
	IProppedDatedMutation,
	SetMutationTypes,
	TreePropertyNames,
	UserPropertyNames
} from '../interfaces';

export const sampleTreeMutation: IProppedDatedMutation<FieldMutationTypes, TreePropertyNames> =
	{
		data: TREE_ID3,
		propertyName: TreePropertyNames.PARENT_ID,
		timestamp: Date.now(),
		type: FieldMutationTypes.SET,
	};
export const sampleUserMutation: IProppedDatedMutation<FieldMutationTypes, UserPropertyNames> =
	{
		data: '2340985',
		propertyName: UserPropertyNames.OPEN_MAP_ID,
		timestamp: Date.now(),
		type: FieldMutationTypes.SET,
	};

export const sampleDatedSetMutation: IDatedMutation<SetMutationTypes> =
	{
		data: '12345',
		timestamp: Date.now(),
		type: SetMutationTypes.ADD,
	};

export const sampleDatedFieldMutation: IDatedMutation<FieldMutationTypes> = {
	data: '12345',
	timestamp: Date.now(),
	type: FieldMutationTypes.SET,
};
