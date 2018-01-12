import {inject, injectable} from 'inversify';
import {TYPES} from '../types';
import {ISigmaEventListener} from '../interfaces';
import {log} from '../../core/log'

@injectable()
export class SigmaEventListener implements ISigmaEventListener {
    private tooltipOpener
    private sigmaInstance
    constructor(@inject(TYPES.SigmaEventListenerArgs){tooltipOpener, sigmaInstance}) {
        this.tooltipOpener = tooltipOpener
        this.sigmaInstance = sigmaInstance
    }
    public startListening() {
        log('sigmaEventListener called')
        // this.sigmaInstance.bind('clickNode', (event) => {
        //     log('clickNode eventListener called!!!!!')
        //     const nodeId = event && event.data &&
        //         event.data.node && event.data.node.id
        //     const sigmaNode = this.sigmaInstance.graph.nodes(nodeId)
        //     this.tooltipOpener.openTooltip(sigmaNode)
        // })
        debugger;
        this.sigmaInstance.bind('click', (event) => {
            log('click eventListener called!!!!!')
            // const nodeId = event && event.data &&
            //     event.data.node && event.data.node.id
            // const sigmaNode = this.sigmaInstance.graph.nodes(nodeId)
            // this.tooltipOpener.openTooltip(sigmaNode)
        })
        this.sigmaInstance.bind('doubleClick', (event) => {
            log('doubleClick eventListener called!!!!!')
            // const nodeId = event && event.data &&
            //     event.data.node && event.data.node.id
            // const sigmaNode = this.sigmaInstance.graph.nodes(nodeId)
            // this.tooltipOpener.openTooltip(sigmaNode)
        })
    }
}

export class SigmaEventListenerArgs {
    @inject(TYPES.ITooltipOpener) public tooltipOpener
    @inject(TYPES.ISigma) public sigmaInstance
}
