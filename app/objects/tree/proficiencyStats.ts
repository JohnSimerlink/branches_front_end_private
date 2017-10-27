import {PROFICIENCIES} from '../../components/proficiencyEnum';
export function addObjToProficiencyStats(proficiencyStats, proficiencyObj) {
    Object.keys(proficiencyObj).forEach(key => {
        proficiencyStats[key] += proficiencyObj[key]
    })
    return proficiencyStats
}
export function incrementProficiencyStatsCategory(proficiencyStats, proficiency) {
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
