import {
	IPercentage,
	radian
} from '../interfaces';

export class MathUtils {
	public static percentageToRadians(percentage: IPercentage): radian {
		return percentage * 2 * Math.PI as radian;
	}
}
