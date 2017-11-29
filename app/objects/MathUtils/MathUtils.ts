type radian = number // between 0 and 2 pi
class MathUtils {
    public static percentageToRadians(percentage: number): radian {
        return percentage * 2 * Math.PI as radian
    }
}
export {MathUtils, radian}
