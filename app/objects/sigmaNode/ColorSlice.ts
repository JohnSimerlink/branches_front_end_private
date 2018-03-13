import {inject, injectable} from 'inversify';
import {radian} from '../interfaces';
import {TYPES} from '../types';
import {UIColor} from '../uiColor';

@injectable()
class ColorSlice {
    @inject(TYPES.UIColor) public color: UIColor;
    @inject(TYPES.radian) public start: radian;
    @inject(TYPES.radian) public end: radian
}
export {ColorSlice}
