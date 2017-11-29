// import {myContainer} from './inversify.config';
import 'reflect-metadata'
import {log} from './app/core/log';
import {IActivatableDatedMutation} from './app/objects/mutations/IMutation';
import {TYPES} from './app/objects/types';

// const ActivatableDatedMutation = myContainer.val<IActivatableDatedMutation>(TYPES.IActivatableDatedMutation)
// const ActivatableDatedMutationArr = myContainer.getAll<IActivatableDatedMutation>(TYPES.IActivatableDatedMutation)
import {Point} from './app/objects/point/point';

const p = new Point({x: 8, y: 6})
// log(JSON.stringify(ActivatableDatedMutation))
// log(JSON.stringify(ActivatableDatedMutationArr))
log(JSON.stringify(p))
