import {PROFICIENCIES} from '../proficiency/proficiencyEnum';

interface IContentUserData {
    overdue: boolean;
    timer: number;
    proficiency: PROFICIENCIES;
    lastRecordedStrength;
}
export {IContentUserData}
