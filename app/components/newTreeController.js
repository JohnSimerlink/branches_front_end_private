import {newTree} from '../objects/newTree.js'

//temporary hacky solution for controller
const newTreeCtrl = {
    createNewTreeClick: function (event) {
        var newTreeForm = event.target.parentNode;

        let content = {};
        let parentId = newTreeForm.querySelector('.newTree-parentId').value;

        if (this.treeType === 'fact') {
            let question = newTreeForm.querySelector('.newTree-question').value;
            let answer = newTreeForm.querySelector('.newTree-answer').value;

            content = {question, answer};
        }
        if (this.treeType === 'heading') {
            let title = newTreeForm.querySelector('.newTree-title').value;
            content = {title};
        }
        newTree(this.treeType, parentId, content)
    },
    selectTreeType: function (event, treeType) {
        this.treeType = treeType;
        console.log("Tree type " + treeType);
        document.getElementsByClassName('tree-' + this.treeType)[0].classList.toggle['hidden'];
    }
}
window.newTreeCtrl = newTreeCtrl;
