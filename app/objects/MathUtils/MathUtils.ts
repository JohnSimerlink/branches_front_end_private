import {IPercentage, radian} from '../interfaces';

class MathUtils {
    public static percentageToRadians(percentage: IPercentage): radian {
        return percentage * 2 * Math.PI as radian
    }
}
export {MathUtils}
