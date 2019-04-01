import {
	IHash,
	Iterable
} from '../interfaces';
import {IFlashcardTreeData} from './IFlashcardTreeData';

export interface IFlashcardTree extends Iterable {
	data: IFlashcardTreeData;
	children: IHash<IFlashcardTree>;
}
