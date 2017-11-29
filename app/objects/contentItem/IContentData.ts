import {CONTENT_TYPES} from './ContentTypes';

interface IContentData {
    type: CONTENT_TYPES;
    question?: string;
    answer?: string;
    title?: string;
}

export {IContentData}
