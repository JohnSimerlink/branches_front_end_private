// import {proficiencyToColor} from "../app/components/proficiencyEnum";
import * as assert from 'assert'
import {expect} from 'chai'
import {} from 'mocha' // types

import {addObjToProficiencyStats} from '../app/objects/tree/proficiencyStats';

describe('addObjToProficiencyStats', () => {

    it('should add a standalone ONE object to the current object', () => {
        const proficiencyStats = {
            UNKNOWN: 5,
            ONE: 4,
            TWO: 1,
            THREE: 4,
            FOUR: 2,
        }
        const ONE = {ONE: 1}
        const answer = {
            UNKNOWN: 5,
            ONE: 5,
            TWO: 1,
            THREE: 4,
            FOUR: 2,
        }
        const attemptedAnswer = addObjToProficiencyStats(proficiencyStats, ONE)
        expect(attemptedAnswer).to.deep.equal(answer)

    })
    it('should correctly add another object to the current object 1', () => {
        const proficiencyStats = {
            UNKNOWN: 5,
            ONE: 4,
            TWO: 1,
            THREE: 4,
            FOUR: 2,
        }
        const obj = {
            UNKNOWN: 3,
            ONE: 1,
            TWO: 4,
            THREE: 6,
            FOUR: 2,
        }
        const answer = {
            UNKNOWN: 8,
            ONE: 5,
            TWO: 5,
            THREE: 10,
            FOUR: 4,
        }
        expect(addObjToProficiencyStats(proficiencyStats, obj)).to.deep.equal(answer)

    })
    it('should correctly add another object to the current object 1', () => {
        const proficiencyStats = {
            UNKNOWN: 0,
            ONE: 4,
            TWO: 1,
            THREE: 4,
            FOUR: 2,
        }
        const obj = {
            UNKNOWN: 3,
            ONE: 1,
            TWO: 4,
            THREE: 6,
            FOUR: 0,
        }
        const answer = {
            UNKNOWN: 3,
            ONE: 5,
            TWO: 5,
            THREE: 10,
            FOUR: 2,
        }
        expect(addObjToProficiencyStats(proficiencyStats, obj)).to.deep.equal(answer)

    })

})
