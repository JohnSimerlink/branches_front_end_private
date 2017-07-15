import md5 from 'md5'
import getFirebase from './firebaseService.js';
const firebase = getFirebase();
const treesRef = firebase.database().ref('trees');
const trees = {};
import {Config} from './config.js'

class OfflineTree {
    constructor (factId, parentId){
        this.factId = factId;
        this.parentId = parentId;
        this.children = [];
        this.id = md5(JSON.stringify({factId:factId, parentId:parentId, children: this.children}))// id mechanism for trees may very well change
    }
}
class OnlineTree {
    constructor(factIdOrTreeObj, parentId) {
        if (typeof factIdOrTreeObj === 'object'){
            var treeObj = factIdOrTreeObj
            this.loadObject(treeObj)
        }
        else {
            var factId = factIdOrTreeObj
            this.createAndPushObjectToDB(factId, parentId)
        }
        console.log('the object just created is: ',this)
    }
    loadObject(treeObj){
        const self = this;
        Object.keys(treeObj).forEach(key => self[key] = treeObj[key])
    }
    createAndPushObjectToDB(factId, parentId){
        this.factId = factId;
        this.parentId = parentId;
        this.children = [];

        const treeObj = {factId: factId, parentId: parentId, children: this.children}
        this.id = md5(JSON.stringify(treeObj))
        this.treeRef = treesRef.push({
            id: this.id,
            factId,
            parentId,
            children: this.children
        })
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