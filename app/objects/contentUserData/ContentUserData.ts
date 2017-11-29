// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import {PROFICIENCIES} from '../../proficiencyEnum';
import {TYPES} from '../types';
import {IContentUserData} from './IContentUserData';

@injectable()
class ContentUserData implements IContentUserData {
    public overdue: boolean;
    public timer: number;
    public proficiency: PROFICIENCIES;
    public lastRecordedStrength: any;
    constructor(@inject(TYPES.ContentUserDataArgs) {overdue, timer, proficiency, lastRecordedStrength}) {
        this.overdue = overdue
        this.timer = timer
        this.proficiency = proficiency
        this.lastRecordedStrength = lastRecordedStrength
    }
}

@injectable()
class ContentUserDataArgs {
    @inject(TYPES.Boolean) public overdue: boolean;
    @inject(TYPES.Number) public timer: number;
    @inject(TYPES.PROFICIENCIES) public proficiency: PROFICIENCIES;
    @inject(TYPES.Any) public lastRecordedStrength: any;
}

export {ContentUserData, ContentUserDataArgs}
