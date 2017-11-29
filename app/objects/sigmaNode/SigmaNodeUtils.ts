// tslint:disable object-literal-sort-keys
import {start} from 'repl';
import {MathUtils} from '../MathUtils/MathUtils';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {ProficiencyUtils} from '../proficiency/ProficiencyUtils';
import {IProficiencyStats} from '../proficiencyStats/IProficiencyStats';
import {IColorSlice} from './IColorSlice';

const INITIAL_START_RADIANS = -Math.PI / 2 // north
class SigmaNodeUtils {
    public static getColorSlicesFromProficiencyStats(proficiencyStats: IProficiencyStats): IColorSlice[] {
        const colorSlices: IColorSlice[] = []

        const numLeaves = Object.keys(proficiencyStats).reduce(
            (accum, statKey) => {
                return accum + proficiencyStats[statKey]
        }, 0)
        if (numLeaves === 0) {
            throw new RangeError('There should be more than zero leaves!')
        }

        const unknownPercentage = proficiencyStats.UNKNOWN / numLeaves
        const onePercentage = proficiencyStats.ONE / numLeaves
        const twoPercentage = proficiencyStats.TWO / numLeaves
        const threePercentage = proficiencyStats.THREE / numLeaves
        const fourPercentage = proficiencyStats.FOUR / numLeaves

        let startRadians = INITIAL_START_RADIANS // start at North
        let endRadians;
        if (unknownPercentage) {
            endRadians = startRadians + MathUtils.percentageToRadians(unknownPercentage)
            const unknownColorSlice = {
                color: ProficiencyUtils.getColor(PROFICIENCIES.UNKNOWN),
                start: startRadians,
                end: endRadians,
            }
            colorSlices.push(unknownColorSlice)
            startRadians = endRadians
        }

        if (onePercentage) {
            endRadians = startRadians + MathUtils.percentageToRadians(onePercentage)
            const oneColorSlice = {
                color: ProficiencyUtils.getColor(PROFICIENCIES.ONE),
                start: startRadians,
                end: endRadians,
            }
            colorSlices.push(oneColorSlice)
            startRadians = endRadians
        }

        if (twoPercentage) {
            endRadians = startRadians + MathUtils.percentageToRadians(twoPercentage)
            const twoColorSlice = {
                color: ProficiencyUtils.getColor(PROFICIENCIES.UNKNOWN),
                start: startRadians,
                end: endRadians,
            }
            colorSlices.push(twoColorSlice)
            startRadians = endRadians
        }

        if (threePercentage) {
            endRadians = startRadians + MathUtils.percentageToRadians(threePercentage)
            const threeColorSlice = {
                color: ProficiencyUtils.getColor(PROFICIENCIES.THREE),
                start: startRadians,
                end: endRadians,
            }
            colorSlices.push(threeColorSlice)
            startRadians = endRadians
        }

        if (fourPercentage) {
            endRadians = startRadians + MathUtils.percentageToRadians(fourPercentage)
            const fourColorSlice = {
                color: ProficiencyUtils.getColor(PROFICIENCIES.UNKNOWN),
                start: startRadians,
                end: endRadians,
            }
            colorSlices.push(fourColorSlice)
            startRadians = endRadians
        }

        return colorSlices
    }
}
export {SigmaNodeUtils, INITIAL_START_RADIANS }
