// tslint:disable object-literal-sort-keys
import {expect} from 'chai'
import {IColorSlice, IProficiencyStats} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {ProficiencyUtils} from '../proficiency/ProficiencyUtils';

import {INITIAL_START_RADIANS, SigmaNodeUtils} from './SigmaNodeUtils';

describe('Get Color Slices from Proficiency Stats', () => {
    it('should do one hundred percent COLOR_ONE for one item proficiency ONE and zero items everything else', () => {
        const proficiencyStats: IProficiencyStats = {
            ONE: 1
        } as IProficiencyStats
        const expectedColorSlices: IColorSlice[] = [
            {
                color: ProficiencyUtils.getColor(PROFICIENCIES.ONE),
                start: INITIAL_START_RADIANS,
                end: INITIAL_START_RADIANS + 2 * Math.PI
            }
        ]
        const colorSlices = SigmaNodeUtils.getColorSlicesFromProficiencyStats(proficiencyStats)
        expect(colorSlices).to.deep.equal(expectedColorSlices)
    })
    it('should do one hundred percent COLOR_UNKNOWN for one item proficiency UNKNOWN' +
        ' and no color everything else', () => {
        const proficiencyStats: IProficiencyStats = {
            UNKNOWN: 1
        } as IProficiencyStats
        const expectedColorSlices: IColorSlice[] = [
            {
                color: ProficiencyUtils.getColor(PROFICIENCIES.UNKNOWN),
                start: INITIAL_START_RADIANS,
                end: INITIAL_START_RADIANS + 2 * Math.PI
            }
        ]
        const colorSlices = SigmaNodeUtils.getColorSlicesFromProficiencyStats(proficiencyStats)
        expect(colorSlices).to.deep.equal(expectedColorSlices)
    })
    it('ColorSlices: two proficiency THREE, two proficiency ONE -' +
        ' should do first fifty percent COLOR_THREE for two items that are proficiency THREE' +
        ' and the next fifty percent COLOR_ONE for two items PROFICIENCY UNKNOWN', () => {
        const proficiencyStats: IProficiencyStats = {
            THREE: 2,
            ONE: 2,
        } as IProficiencyStats
        const expectedColorSlices: IColorSlice[] = [
            {
                color: ProficiencyUtils.getColor(PROFICIENCIES.ONE),
                start: INITIAL_START_RADIANS,
                end: INITIAL_START_RADIANS + Math.PI
            },
            {
                color: ProficiencyUtils.getColor(PROFICIENCIES.THREE),
                start: INITIAL_START_RADIANS + Math.PI,
                end: INITIAL_START_RADIANS + 2 * Math.PI
            },
        ]
        const colorSlices = SigmaNodeUtils.getColorSlicesFromProficiencyStats(proficiencyStats)
        expect(colorSlices).to.deep.equal(expectedColorSlices)
    })
})
