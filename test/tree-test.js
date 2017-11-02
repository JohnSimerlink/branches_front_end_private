// var cleanup = require('jsdom-global')()
// import {PROFICIENCIES} from "../app/components/proficiencyEnum.ts";
// import {calculateMillisecondsTilNextReview} from '../app/components/reviewAlgorithm/review'
// import {Tree} from "../app/objects/tree/tree";
// import {TreeMutationTypes} from "../app/objects/mutations/IMutable";
// import {expect} from 'chai'
// import * as curve from '../app/forgettingCurve'
// const tree1 = {
//     children: {},
//     userProficiencyStatsMap: {
//         'user1': {
//             //total = 19
//             UNKNOWN: 5,
//             ONE: 7,
//             TWO: 1,
//             THREE: 2,
//             FOUR: 4,
//         },
//         'user2': {
//             //total = 19
//             UNKNOWN: 15,
//             ONE: 1,
//             TWO: 1,
//             THREE: 1,
//             FOUR: 1,
//         },
//     }
// }
// const tree2 = {
//     children: {'3': true}
// }
// const treeWithFalseChildId3 = {
//     children: {'3': false}
// }
// const tree3 = {
//     children: {'4': true}
// }
// describe('Add a leaf', () => {
//
//     //1 - update users proficiency stats, for an individual user stats map
//     //2 - test for checking getting all users who have studied an individual tree
//     //do action here:
//     it('Should be added to children set', () => {
//         expect(1).to.equal(0)
//     })
//     it('Should correctly update proficiencyAggregation for all users for current tree', () => {
//         expect(1).to.equal(0)
//     })
//     it('Should correctly update proficiencyAggregation for all users for all ancestor trees', () => {
//         expect(1).to.equal(0)
//     })
// })
//
// describe('Tree Mutations is addTree redundant', () => {
//     it('Should mark a TREE_MUTATIONS.ADD_TREE(treeId) on a tree with the child treeId as redundant', () => {
//         const tree = Object.create(Tree, tree2)
//         const mutation = {
//             type:  TreeMutationTypes.ADD_TREE,
//             data: {
//                 treeId: 3
//             }
//         }
//         expect(tree._isMutationRedundant(mutation).to.be(true))
//     })
//     it('Should mark a TREE_MUTATIONS.ADD_TREE(treeId) on a tree without the child treeId as NOT redundant', () => {
//         const tree = {...tree3}
//         const mutation = {
//             type:  TreeMutationTypes.ADD_TREE,
//             data: {
//                 treeId: 3
//             }
//         }
//         expect(tree._isMutationRedundant(mutation).to.be(false))
//         expect(treeWithFalseChildId3._isMutationRedundant(mutation).to.be(false))
//     })
//
// })
// describe('Remove a subtree : with an unknown proficiency', () => {
//     it('Should be removed from children set', () => {
//         expect(1).to.equal(0)
//     })
//     it('Should correctly update proficiencyAggregation for all users for current tree', () => {
//         expect(1).to.equal(0)
//         //expect numUnknown before and after to be one less
//     })
//     it('Should correctly update proficiencyAggregation for all users for ancestor trees', () => {
//         expect(1).to.equal(0)
//         //expect numUnknown before and after to be one less
//     })
// })
//
// describe('disconnect a subtree : with a TWO proficiency and overdue', () => {
//     it('Should be removed from children set', () => {
//         expect(1).to.equal(0)
//     })
//     it('Should add the subtree as a child of the "{userid}/trash" tree', () => {
//         expect(1).to.equal(0)
//     })
//     it('Should correctly update proficiencyAggregation for all users current tree', () => {
//         expect(1).to.equal(0)
//         //expect numTwo before and after to be one less
//     })
//     it('Should correctly update proficiencyAggregation for all users for all ancestor trees', () => {
//         expect(1).to.equal(0)
//         //expect numTwo before and after to be one less
//     })
//     it('Should correctly update numOverdue for all users for all current tree', () => {
//         expect(1).to.equal(0)
//         //expect numOverdue before and after to be one less
//     })
//     it('Should correctly update numOverdue for all users for all ancestor tree', () => {
//         expect(1).to.equal(0)
//         //expect numOverdue before and after to be one less
//     })
//     it('Should correctly update timer for all users for current tree', () => {
//         expect(1).to.equal(0)
//         //expect timer before and after to be less by the amount of time spend on the removed subtree
//     })
//     it('Should correctly update timer for all users for all ancestor trees', () => {
//         expect(1).to.equal(0)
//         //expect numOverdue before and after to be one less
//     })
// })
