import {injectFakeDom} from './testHelpers/injectFakeDom';
import {SigmaRenderManagerArgs} from './objects/sigmaNode/SigmaRenderManager';
import {myContainer, myContainerLoadAllModules} from '../inversify.config';
import {TYPES} from './objects/types';

injectFakeDom();

myContainerLoadAllModules({fakeSigma: true});
const sigmaRenderManagerArgs: SigmaRenderManagerArgs
    = myContainer.get<SigmaRenderManagerArgs>(TYPES.SigmaRenderManagerArgs); // new SigmaRenderManager()
