import md5 from 'md5'
import getFirebase from './firebaseService.js';
const firebase = getFirebase();
window.firebase = firebase
const treesRef = firebase.database().ref('trees');
const trees = {};
import {Config} from './config.js'

function loadObject(treeObj, self){
    console.log('LOAD OBJECT CALLED on', treeObj, self)
    Object.keys(treeObj).forEach(key => self[key] = treeObj[key])
}
class BaseTree {
    constructor (factId, parentId, x, y){
        var treeObj
        if (arguments[0] && typeof arguments[0] === 'object'){
            console.log('ARGUMENTS[0] IS', arguments[0])
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
        console.log("ONLINE TREE - the object about to be pushed to db is", {id: this.id, factId, parentId, children: this.children})
        firebase.database().ref('trees/' + this.id).update(
            {
                id: this.id,
                factId,
                parentId,
                x,
                y
            }
        )
        console.log('the object just created is: ',this)
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

    removeChild(treeId) {
        var children = {}
        // Object.keys(this.children).forEach(key => {
        //     if (key != treeId)
        // })
    }

    changeParent(newParentId) {
        this.parentId = newParentId
        firbase.database().ref('trees/' + this.id).update({
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
