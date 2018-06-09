import {IContentData, IContentDataFromDB} from '../interfaces';

export function isValidContent(content: IContentData) {
	return isValidContentFact(content)
		|| isValidContentNotFact(content);
	// && content.children instanceof Array
}

function isValidContentNotFact(content: IContentData) {
	return content && content.type && content.title;
}

function isValidContentFact(content: IContentData) {
	return content && content.type && content.question && content.answer;
}

export function isValidContentDataFromDB(contentDataFromDB: IContentDataFromDB): boolean {
	return !!(
		isValidContentDataFromDBShared(contentDataFromDB)
		&& (isValidContentDataFromDBFact(contentDataFromDB) || isValidContentDataFromDBNotFact(contentDataFromDB)
		)
	);
}

function isValidContentDataFromDBShared(contentDataFromDB: IContentDataFromDB) {
	return contentDataFromDB && contentDataFromDB.type && contentDataFromDB.type.val;
}

function isValidContentDataFromDBNotFact(contentDataFromDB: IContentDataFromDB) {
	return contentDataFromDB.title && contentDataFromDB.title.val;
}

function isValidContentDataFromDBFact(contentDataFromDB: IContentDataFromDB) {
	return contentDataFromDB.question && contentDataFromDB.question.val
		&& contentDataFromDB.answer && contentDataFromDB.answer.val;
}
