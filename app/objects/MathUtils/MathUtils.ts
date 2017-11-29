type radian = number // between 0 and 2 pi
type IPercentage = number // between 0 and 1
class MathUtils {
    public static percentageToRadians(percentage: IPercentage): radian {
        return percentage * 2 * Math.PI as radian
    }
}
export {MathUtils, radian, IPercentage}
