import 'reflect-metadata';
import {log} from './log';
import {AppContainer} from './appContainer';
import {myContainer, myContainerLoadAllModules} from '../../inversify.config';
import {TYPES} from '../objects/types';

myContainerLoadAllModules({fakeSigma: false});
const appContainer = myContainer.get<AppContainer>(TYPES.AppContainer);
appContainer.start();
