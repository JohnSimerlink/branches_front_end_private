import test from 'ava'
import {expect} from 'chai'
import {getASampleFlashcardTreeData} from './FlashcardTreeTestHelpers'
import {FlashcardTree} from './FlashcardTree'
test('When the tree only no children, FlashcardTree iterator should iterate just once and return the root data node', t => {
    const flashcardTreeData = getASampleFlashcardTreeData()
    const flashcardTree = new FlashcardTree({
        data: flashcardTreeData,
        children: {}
    })
    // const iterable = flashcardTree()

    t.fail()
})
