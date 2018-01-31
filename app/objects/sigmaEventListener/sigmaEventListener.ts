import {inject, injectable} from 'inversify';
import {TYPES} from '../types';
import {IFamilyLoader, ISigma, ISigmaEventListener, ITooltipOpener} from '../interfaces';
import {log} from '../../core/log'

@injectable()
export class SigmaEventListener implements ISigmaEventListener {
    private tooltipOpener: ITooltipOpener
    private sigmaInstance: ISigma
    private familyLoader: IFamilyLoader
    constructor(@inject(TYPES.SigmaEventListenerArgs){
        tooltipOpener,
        sigmaInstance,
        familyLoader
    }: SigmaEventListenerArgs ) {
        this.tooltipOpener = tooltipOpener
        this.sigmaInstance = sigmaInstance
        this.familyLoader = familyLoader
    }
    public startListening() {
        log('sigmaEventListener called')
        this.sigmaInstance.bind('clickNode', (event) => {
            log('clickNode eventListener called!!!!!')
            const nodeId = event && event.data &&
                event.data.node && event.data.node.id
            const sigmaNode = this.sigmaInstance.graph.nodes(nodeId)
            this.tooltipOpener.openTooltip(sigmaNode)
        })
        this.sigmaInstance.bind('overNode', (event) => {
            const nodeId = event && event.data &&
                event.data.node && event.data.node.id
            log('overNode eventListener called!!!!!', nodeId)
            this.familyLoader.loadFamilyIfNotLoaded(nodeId)
        })
        // debugger;
        // this.sigmaInstance.bind('click', (event) => {
        //     log('click eventListener called!!!!!')
        //     // const nodeId = event && event.data &&
        //     //     event.data.node && event.data.node.id
        //     // const sigmaNode = this.sigmaInstance.graph.nodes(nodeId)
        //     // this.tooltipOpener.openTooltip(sigmaNode)
        // })
        // this.sigmaInstance.bind('doubleClick', (event) => {
        //     log('doubleClick eventListener called!!!!!')
        //     // const nodeId = event && event.data &&
        //     //     event.data.node && event.data.node.id
        //     // const sigmaNode = this.sigmaInstance.graph.nodes(nodeId)
        //     // this.tooltipOpener.openTooltip(sigmaNode)
        // })
    }
}

export class SigmaEventListenerArgs {
    @inject(TYPES.ITooltipOpener) public tooltipOpener: ITooltipOpener
    @inject(TYPES.ISigma) public sigmaInstance: ISigma
    @inject(TYPES.IFamilyLoader) public familyLoader: IFamilyLoader
}
