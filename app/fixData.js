import user from './objects/user'
import ContentItems from "./objects/contentItems";

function fixInteractionData(){
   Object.keys(user.branchesData.items).forEach(async contentId => {
       console.log('the key we are trying to find the content for is', contentId)
       const item = await ContentItems.get(contentId)
       console.log('the content we got is', item)
       user.set('interactions', item.interactions)
       user.setInteractionsForItem(contentId, item.interactions)
   })
}
window.fixInteractionData = fixInteractionData