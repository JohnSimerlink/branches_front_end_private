import {IHash, IProficiencyStats} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';

export function incrementProficiencyStatsCategory(proficiencyStats: IProficiencyStats, proficiency: number) {
    if (proficiency <= PROFICIENCIES.UNKNOWN) {
        proficiencyStats.UNKNOWN++;
    } else if (proficiency <= PROFICIENCIES.ONE) {
        proficiencyStats.ONE++;
    } else if (proficiency <= PROFICIENCIES.TWO) {
        proficiencyStats.TWO++;
    } else if (proficiency <= PROFICIENCIES.THREE) {
        proficiencyStats.THREE++;
    } else if (proficiency <= PROFICIENCIES.FOUR) {
        proficiencyStats.FOUR++;
    }
    return proficiencyStats;
}
