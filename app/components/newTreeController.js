import {newTree} from '../objects/newTree.js'
//temporary hacky solution for controller
const newTreeCtrl = {
    createNewTreeClick: function (event) {
        var newTreeForm = event.target.parentNode
        var question = newTreeForm.querySelector('.newTree-question').value
        var answer = newTreeForm.querySelector('.newTree-answer').value
        var parentId = newTreeForm.querySelector('.newTree-parentId').value

        newTree(question, answer, parentId)
    }
}
window.newTreeCtrl = newTreeCtrl
