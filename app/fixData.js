import {user} from './objects/user'
import ContentItems from "./objects/contentItems";

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
