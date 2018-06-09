import {IFlashcardTreeData} from './IFlashcardTreeData';
import {IHash} from '../interfaces';
import {IFlashcardTree} from './IFlashcardTree';

export interface IFlashcardTreeArgs {
	data: IFlashcardTreeData;
	children: IHash<IFlashcardTree>;
}
