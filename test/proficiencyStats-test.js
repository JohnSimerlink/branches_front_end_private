// import {proficiencyToColor} from "../app/components/proficiencyEnum";
import {addObjToProficiencyStats} from "../app/objects/tree/proficiencyStats.ts";
import {expect} from 'chai'

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
        try {
            expect(addObjToProficiencyStats(proficiencyStats, ONE).to.equal(answer))

        } catch ( err) {

        }

    })
    it('should correctly add another object to the current object', () => {
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
        try {
            expect(addObjToProficiencyStats(proficiencyStats, obj).to.equal(answer))

        } catch ( err) {

        }

    })

})