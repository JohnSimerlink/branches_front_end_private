import md5 from 'md5'
import firebase from './firebaseService.js';
const treesRef = firebase.database().ref('trees');
const trees = {};
import {Trees} from './trees.js'
import timers from './timers'

function loadObject(treeObj, self){
    Object.keys(treeObj).forEach(key => self[key] = treeObj[key])
}
export class Tree {

    constructor(contentId, contentType, parentId, x, y) {
        var treeObj
        if (arguments[0] && typeof arguments[0] === 'object'){
            treeObj = arguments[0]
            loadObject(treeObj, this)
            return
        }

        this.contentId = contentId
        this.contentType = contentType
        this.parentId = parentId;
        this.children = {};

        this.x = x
        this.y = y

        treeObj = {contentType: this.contentType, contentId: this.contentId, parentId: parentId, children: this.children}
        this.id = md5(JSON.stringify(treeObj))
        if (typeof arguments[0] === 'object'){//TODO: use a boolean to determine if the tree already exists. or use Trees.get() and Trees.create() separate methods, so we aren't getting confused by the same constructor
            return
        }
        firebase.database().ref('trees/' + this.id).update(
            {
                id: this.id,
                contentId,
                contentType,
                parentId,
                x,
                y
            }
        )
    }
    /**
     * Add a child tree to this tree
     * @param treeId
     */
    addChild(treeId) {
        console.log('add child called in tree.js')
        // this.treeRef.child('/children').push(treeId)
        var children = this.children || {}
        children[treeId] = true
        var updates = {
            children
        }
        firebase.database().ref('trees/' +this.id).update(updates)
    }

    unlinkFromParent(){
       var treeId = this.id
       Trees.get(this.parentId).then(parentTree => {
           parentTree.removeChild(treeId)
       })
       this.changeParent(null)
    }

    removeChild(childId) {
        delete this.children[childId]

        firebase.database().ref('trees/' + this.id).update({children: this.children})
    }

    changeParent(newParentId) {
        this.parentId = newParentId
        firebase.database().ref('trees/' + this.id).update({
            parentId: newParentId
        })
    }

    changeFact(newfactid) {
        this.factId = newfactid
        firebase.database().ref('trees/' + this.id).update({
           factId: newfactid
        })
    }


    /**
     * Change the content of a given node ("Tree")
     * Available content types currently header and fact
     */
    changeContent(contentId, contentType) {
        this.contentId = contentId;
        this.contentType = contentType;
        firebase.database().ref('trees/' + this.id).update({
            contentId,
            contentType
        });
    }

    /**
     * Used to update tree X and Y coordinates
     * @param prop
     * @param val
     */
    set(prop, val){
        if (this[prop] == val) {
            return;
        }

        var updates = {}
        updates[prop] = val
        // this.treeRef.update(updates)
        firebase.database().ref('trees/' +this.id).update(updates)
        this[prop] = val
    }
}
//TODO: get typeScript so we can have a schema for treeObj
//treeObj  example
/*
 parentId: parentTreeId,
 factId: fact.id,
 x: parseInt(currentNewChildTree.x),
 y: parseInt(currentNewChildTree.y),
 children: {},
 label: fact.question + ' ' + fact.answer,
 size: 1,
 color: Globals.existingColor,
 type: 'tree'
 */
//invoke like a constructor - new Tree(parentId, factId)
