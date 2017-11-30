import {IDetailedUpdates} from './IDetailedUpdates';

interface IDatabaseSaver {
    save(updates: IDetailedUpdates)
}
export {IDatabaseSaver}
