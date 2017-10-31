/* tslint:disable object-literal-sort-keys */
// import {PROFICIENCIES} from '../../components/proficiencyEnum';
/* TODO: for some reason ^^ importing the above causes my unit tests to not work,
 so I have manually copied and pasted the PROFICIENCIES var here
  */
const PROFICIENCIES = {
    UNKNOWN: 0,
    ONE: 12.5,
    TWO: 37.5,
    THREE: 62.5,
    FOUR: 87.5, /* DON"T make this 100. bc 100/100 is 1. and log of 1 is 0.
    bc n/0 is undefined, which is what was happening in our math. */
}

export function addObjToProficiencyStats(proficiencyStats, proficiencyObj) {
    const newStats = {...proficiencyStats}
    Object.keys(proficiencyObj).forEach((key) => {
        newStats[key] = proficiencyObj[key]
    })
    return newStats
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
