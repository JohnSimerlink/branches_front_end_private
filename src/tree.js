import md5 from 'md5'
import getFirebase from './firebaseService.js';
const firebase = getFirebase();
window.firebase = firebase
const treesRef = firebase.database().ref('trees');
const trees = {};
import {Config} from './config.js'
import {Trees} from './trees.js'

function loadObject(treeObj, self){
    Object.keys(treeObj).forEach(key => self[key] = treeObj[key])
}
class BaseTree {
    constructor (factId, parentId, x, y){
        var treeObj
        if (arguments[0] && typeof arguments[0] === 'object'){
            treeObj = arguments[0]
            loadObject(treeObj, this)
            return
        }

        this.factId = factId;
        this.parentId = parentId;
        this.children = {};
        this.x = x
        this.y = y

        treeObj = {factId: factId, parentId: parentId, children: this.children}
        this.id = md5(JSON.stringify(treeObj))
    }
}
class OfflineTree extends BaseTree{
    constructor (factId, parentId, x, y){
        super(...arguments)
    }
}
class OnlineTree extends BaseTree {

    constructor(factId, parentId, x, y) {
        super(...arguments)
        if (typeof arguments[0] === 'object'){//TODO: use a boolean to determine if the tree already exists. or use Trees.get() and Trees.create() separate methods, so we aren't getting confused by the same constructor
            return
        }
        firebase.database().ref('trees/' + this.id).update(
            {
                id: this.id,
                factId,
                parentId,
                x,
                y
            }
        )
    }
    addChild(treeId) {
        // this.treeRef.child('/children').push(treeId)
        var children = this.children || {}
        children[treeId] = true
        var updates = {
            children
        }
        firebase.database().ref('trees/' +this.id).update(updates)
    }

    unlinkFromParent(){
       alert('unlink from parent called')
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
export function Tree(){
    return Config.offlineMode ? new OfflineTree(...arguments) :  new OnlineTree(...arguments);
}
