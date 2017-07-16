import md5 from 'md5'
import getFirebase from './firebaseService.js';
const firebase = getFirebase();
window.firebase = firebase
const treesRef = firebase.database().ref('trees');
const trees = {};
import {Config} from './config.js'

function loadObject(treeObj, self){
    Object.keys(treeObj).forEach(key => self[key] = treeObj[key])
}
class BaseTree {
    constructor (factId, parentId){
        var treeObj
        if (typeof arguments[0] === 'object'){
            treeObj = arguments[0]
            loadObject(treeObj, this)
            return
        }

        this.factId = factId;
        this.parentId = parentId;
        this.children = {};

        treeObj = {factId: factId, parentId: parentId, children: this.children}
        this.id = md5(JSON.stringify(treeObj))
    }
}
class OfflineTree extends BaseTree{
    constructor (factId, parentId){
        super(...arguments)
    }
}
class OnlineTree extends BaseTree {

    constructor(factIdOrTreeObj, parentId) {
        super(...arguments)
        if (typeof arguments[0] === 'object'){
            return
        }
        this.treeRef = treesRef.push({
            id: this.id,
            factId,
            parentId,
            children: this.children
        })
        console.log('the object just created is: ',this)
    }
    addChild(treeId) {
        // this.treeRef.child('/children').push(treeId)
        var children = {}
        children[treeId] = true
        var updates = {
            children
        }
        firebase.database().ref('trees/' +this.id).update(updates)
    }

    removeChild(treeId) {

    }

    changeParent(newParentId) {
        this.treeRef.update({
            parentId: newParentId
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

//invoke like a constructor - new Tree(parentId, factId)
export function Tree(){
    return Config.offlineMode ? new OfflineTree(...arguments) :  new OnlineTree(...arguments);
}
/*
facts can have dependencies

trees can have dependencies

trees can have children

*/