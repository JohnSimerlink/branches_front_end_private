import {injectable} from 'inversify';
import {IContentUserData} from './IContentUserData';

const REGULAR_SIZE = 10
class ContentUserDataUtils {
    public static getSizeFromContentUserData(userContentData: IContentUserData) {
        return REGULAR_SIZE
    }
}
export {ContentUserDataUtils, REGULAR_SIZE}
