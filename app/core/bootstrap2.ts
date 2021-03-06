import 'reflect-metadata';
import {AppContainer} from './appContainer';
import {
	myContainer,
	myContainerLoadAllModules
} from '../../inversify.config';
import {TYPES} from '../objects/types';

console.log('bootstrap2.ts called', (window as any).calculateLoadTimeSoFar(Date.now()))
myContainerLoadAllModules({fakeSigma: false});
const appContainer = myContainer.get<AppContainer>(TYPES.AppContainer);
appContainer.start();

