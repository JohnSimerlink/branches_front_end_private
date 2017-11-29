import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {IProficiencyStats} from './IProficiencyStats';

export function addObjToProficiencyStats(proficiencyStats: IProficiencyStats, deltaObj: IProficiencyStats) {
    const newStats: IProficiencyStats = {...proficiencyStats}
    Object.keys(deltaObj).forEach((key) => {
        newStats[key] = (newStats[key] || 0) + (deltaObj[key] || 0)
    })
    return newStats
}
export function incrementProficiencyStatsCategory(proficiencyStats: IProficiencyStats, proficiency: number) {
    if (proficiency <= PROFICIENCIES.UNKNOWN) {
        proficiencyStats.UNKNOWN++
    } else if (proficiency <= PROFICIENCIES.ONE) {
        proficiencyStats.ONE++
    } else if (proficiency <= PROFICIENCIES.TWO) {
        proficiencyStats.TWO++
    } else if (proficiency <= PROFICIENCIES.THREE) {
        proficiencyStats.THREE++
    } else if (proficiency <= PROFICIENCIES.FOUR) {
        proficiencyStats.FOUR++
    }
    return proficiencyStats
}
