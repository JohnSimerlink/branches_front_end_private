import test from 'ava'
import {log} from '../../app/core/log'
import {injectFakeDom} from '../testHelpers/injectFakeDom';
injectFakeDom()
// log('About to import sigmaConfigurations from inversify config')
import '../../other_imports/sigmaConfigurations.ts'
// log('just imported sigmaConfigurations from inversify config')
import sigma from '../../other_imports/sigma/sigma.core.js'
import {SigmaJs} from 'sigmajs';
import Sigma = SigmaJs.Sigma;
import {GRAPH_CONTAINER_ID} from '../core/globals';
import SigmaConfigs = SigmaJs.SigmaConfigs;

test('Sample sigma instance', t => {
    const sigmaInstance: Sigma = new sigma() // new sigma({
    //     graph: {
    //         nodes: [],
    //         edges: []
    //     },
    //     container: GRAPH_CONTAINER_ID,
    //     glyphScale: 0.7,
    //     glyphFillColor: '#666',
    //     glyphTextColor: 'white',
    //     glyphStrokeColor: 'transparent',
    //     glyphFont: 'FontAwesome',
    //     glyphFontStyle: 'normal',
    //     glyphTextThreshold: 6,
    //     glyphThreshold: 3,
    // } as SigmaConfigs)

    t.pass()
})
