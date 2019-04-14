import {IHash} from '../../objects/interfaces';

export type cents = number;
export interface IMembership {
	price: cents;
}
export const MEMBERSHIPS: IHash<IMembership> = {
	APR_2019_v1__WEEKLY: {
		price: 99
	},
	APR_2019_v1__MONTHLY: {
		price: 199
	},
	APR_2019_v1__YEARLY: {
		price: 1199
	},
};
