import {injectFakeDom} from './testHelpers/injectFakeDom';
injectFakeDom();
import {SigmaRenderManager, SigmaRenderManagerArgs} from './objects/sigmaNode/SigmaRenderManager';
import {ISigmaRenderManager} from './objects/interfaces';
import {myContainer, myContainerLoadAllModules} from '../inversify.config';
import {TYPES} from './objects/types';

myContainerLoadAllModules();
const sigmaRenderManagerArgs: SigmaRenderManagerArgs
    = myContainer.get<SigmaRenderManagerArgs>(TYPES.SigmaRenderManagerArgs); // new SigmaRenderManager()
