/**
 * Created by John on 6/21/2017.
 */
import {getAllFacts, getFact} from './facts.js'
console.log('trees.js imported')
getAllFacts((facts) => {
   Object.keys(facts).forEach((factId) => {
       console.log('factId ' + factId + ' has obj of ' + facts[factId])
    const tree = new Tree(factId, null)
   })
})
const trees = {
    "1": {

    }
}
class Trees {


}
