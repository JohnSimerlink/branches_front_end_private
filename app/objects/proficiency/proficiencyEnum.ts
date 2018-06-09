/* tslint:disable object-literal-sort-keys */
export enum PROFICIENCIES {
	UNKNOWN = 0,
	ONE = 12.5,
	TWO = 37.5,
	THREE = 62.5,
	FOUR = 87.5, /* DON"T make this 100. bc 100/100 is 1. and log of 1 is 0.
    bc n/0 is undefined, which is what was happening in our math. */
}
