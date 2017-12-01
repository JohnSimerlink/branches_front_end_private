import {PROFICIENCIES} from '../proficiency/proficiencyEnum';

interface IContentUserData {
    overdue: boolean;
    timer: number;
    proficiency: PROFICIENCIES;
    lastRecordedStrength; // TODO: this might actually be an object not a simple number
}
export {IContentUserData}
