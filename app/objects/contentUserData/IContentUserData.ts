import {PROFICIENCIES} from '../../proficiencyEnum';

interface IContentUserData {
    overdue: boolean;
    timer: number;
    proficiency: PROFICIENCIES;
    lastRecordedStrength;
}
export {IContentUserData}
