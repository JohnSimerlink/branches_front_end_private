import {CONTENT_TYPES} from './ContentTypes';
import {IContentData} from './IContentData';

const QUESTION_ANSWER_LABEL_SEPARATOR = ': '
class ContentItemUtils {
    public static getLabelFromContent(contentData: IContentData) {
        switch (contentData.type) {
            case CONTENT_TYPES.FACT:
                return contentData.question + QUESTION_ANSWER_LABEL_SEPARATOR + contentData.answer
            case CONTENT_TYPES.SKILL:
                return contentData.title
            case CONTENT_TYPES.CATEGORY:
                return contentData.title
        }
    }
}

export {ContentItemUtils, QUESTION_ANSWER_LABEL_SEPARATOR}
