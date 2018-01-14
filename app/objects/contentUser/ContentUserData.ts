// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import {IContentUserData} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {TYPES} from '../types';

@injectable()
class ContentUserData implements IContentUserData {
    public id: string;
    public overdue: boolean;
    public timer: number;
    public proficiency: PROFICIENCIES;
    public lastRecordedStrength: any;
    constructor(@inject(TYPES.ContentUserDataArgs) {id, overdue, timer, proficiency, lastRecordedStrength}) {
        this.id = id
        this.overdue = overdue
        this.timer = timer
        this.proficiency = proficiency
        this.lastRecordedStrength = lastRecordedStrength
    }
}

@injectable()
class ContentUserDataArgs {
    @inject(TYPES.String) public id: string;
    @inject(TYPES.Boolean) public overdue: boolean;
    @inject(TYPES.Number) public timer: number;
    @inject(TYPES.PROFICIENCIES) public proficiency: PROFICIENCIES;
    @inject(TYPES.Any) public lastRecordedStrength: any;
}

export {ContentUserData, ContentUserDataArgs}
