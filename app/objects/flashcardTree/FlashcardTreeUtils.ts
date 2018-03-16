import {IFlashcardTreeData} from './IFlashcardTreeData'
import {timestamp} from '../interfaces'

export class FlashcardTreeUtils {
    public static getNextTimeToStudy(flashcardData: IFlashcardTreeData): timestamp {
        /*
        If there is no contentUser data for this flashcard,
        or if there is no nextReviewTime for this flashcard,
        then that means the user has never studied this flashcard before.
        We therefore want the user to study the flashcard as soon as possible (now).
        When the heap is ordered by this next time to study property, it will therefore have the user study new items, if there are no items overdue
         */
        const nextTimeToStudy: timestamp =
            flashcardData.contentUser &&
            flashcardData.contentUser.nextReviewTime &&
            flashcardData.contentUser.nextReviewTime.val() || Date.now()

        return nextTimeToStudy
    }
    public static isValid(flashcardData: IFlashcardTreeData): boolean {
        return !!(flashcardData.tree && flashcardData.treeLocation && flashcardData.content)
    }
}
