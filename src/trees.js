/**
 * Created by John on 6/21/2017.
 */
import {Facts} from './facts.js'
console.log('trees.js imported')
Facts.getAll((facts) => {
   Object.keys(facts).forEach((factId) => {
       console.log('factId ' + factId + ' has obj of ' + facts[factId])
   })
})
const trees = {
    "1": {

    }
}
class Trees {


}
