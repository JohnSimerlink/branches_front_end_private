import {IContentUserData} from '../interfaces';
import {DEFAULT_NODE_SIZE} from '../../core/globals';

export class ContentUserDataUtils {
    public static getSizeFromContentUserData(userContentData: IContentUserData) {
        return userContentData.lastRecordedStrength ? size(userContentData.lastRecordedStrength): DEFAULT_NODE_SIZE
    }
}
function size(strength: number) {
    return strength / 30 + 1

}
function sigmoid(x: number): number {
    return 1 / (1 + Math.E^(-1 * x))
}
