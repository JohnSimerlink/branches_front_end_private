import {user} from './objects/user'
import ContentItems from "./objects/contentItems";
import {Trees} from "./objects/trees";

function fixInteractionData(){
   Object.keys(user.branchesData.items).forEach(async contentId => {
       console.log('the key we are trying to find the content for is', contentId)
       const item = await ContentItems.get(contentId)
       console.log('the content we got is', item)
       user.set('interactions', item.interactions)
       user.setInteractionsForItem(contentId, item.interactions, true)
   })
}
export async function clearInteractionsForHeadings(){
    const headings = await ContentItems.getHeadings()
    console.log("the headings whose interactions are going to be cleared are", headings, Object.keys(headings).length)
    return await Promise.all(
        Object.keys(headings).map(async headingKey => {
            user.clearInteractionsForItem(headingKey)
            const contentItem = await ContentItems.get(headingKey)
            contentItem.clearInteractions(true)
        })
    )
}
if (typeof window !== 'undefined'){
    window.fixInteractionData = fixInteractionData
}

function convertTreeUserDataForAllTrees(){
}
export async function convertTreeDataForATree(treeId) {
    if (typeof treeId === 'undefined' || !treeId){
        return
    }
    console.log("CONVERT: START ", treeId)
    const tree = await Trees.get(treeId)
    const treeData = {
        x: tree.x,
        y: tree.y,
        id: tree.id,
        level: tree.level,
        contentId: tree.contentId,
        parentId: tree.parentId,
    }
    tree.set('treeData', treeData)
}
export async function convertTreeUserDataForATree(treeId) {
    if (typeof treeId === 'undefined' || !treeId){
        return
    }
    console.log("CONVERT: START ", treeId)
    const tree = await Trees.get(treeId)
    const usersData = {} // userId : userData
    tree.userProficiencyStatsMap && Object.keys(tree.userProficiencyStatsMap).forEach(userId => {
        usersData[userId] = usersData[userId] || {}
        usersData[userId].proficiencyStats = tree.userProficiencyStatsMap[userId]
    })
    tree.userAggregationTimerMap && Object.keys(tree.userAggregationTimerMap).forEach(userId => {
        usersData[userId] = usersData[userId] || {}
        usersData[userId].aggregationTimer = tree.userAggregationTimerMap[userId]
    })
    tree.userNumOverdueMap && Object.keys(tree.userNumOverdueMap).forEach(userId => {
        usersData[userId] = usersData[userId] || {}
        usersData[userId].numOverdue = tree.userNumOverdueMap[userId]
    })
    console.log("CONVERT: end ", usersData)
    tree.set('usersData', usersData)
}
