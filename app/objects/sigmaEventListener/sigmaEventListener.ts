import {inject, injectable, tagged} from 'inversify';
import {TYPES} from '../types';
import {
    IBindable, IFamilyLoader, IMoveTreeCoordinateMutationArgs, ISigma, ISigmaEventListener,
    ITooltipOpener
} from '../interfaces';
import {log} from '../../core/log'
import {CustomSigmaEventNames} from './customSigmaEvents';
import {TAGS} from '../tags';
import {Store} from 'vuex';
import {MUTATION_NAMES} from "../../core/store";

@injectable()
export class SigmaEventListener implements ISigmaEventListener {
    private tooltipOpener: ITooltipOpener
    private sigmaInstance: ISigma
    private familyLoader: IFamilyLoader
    private dragListener: IBindable
    private store: Store<any>
    constructor(@inject(TYPES.SigmaEventListenerArgs){
        tooltipOpener,
        sigmaInstance,
        familyLoader,
        dragListener,
        store
    }: SigmaEventListenerArgs ) {
        this.tooltipOpener = tooltipOpener
        this.sigmaInstance = sigmaInstance
        this.familyLoader = familyLoader
        this.dragListener = dragListener
        this.store = store
    }
    public startListening() {
        this.sigmaInstance.bind('clickNode', (event) => {
            const nodeId = event && event.data &&
                event.data.node && event.data.node.id
            const sigmaNode = this.sigmaInstance.graph.nodes(nodeId)
            this.tooltipOpener.openTooltip(sigmaNode)
        })
        // debugger;
        this.sigmaInstance.bind('overNode', (event) => {
            const nodeId = event && event.data &&
                event.data.node && event.data.node.id
            this.familyLoader.loadFamilyIfNotLoaded(nodeId)
        })
        this.dragListener.bind('dragend', (event) => {
            const node = event && event.data && event.data.node
            const nodeId = node.id
            const mutationArgs: IMoveTreeCoordinateMutationArgs = {
                treeId: nodeId,
                point: {x: node.x, y: node.y}
            }
            this.store.commit(MUTATION_NAMES.MOVE_TREE_COORDINATE, mutationArgs)
        })
        // debugger;
        this.sigmaInstance['renderers'][0].bind(CustomSigmaEventNames.CENTERED_NODE, (event) => {
            const nodeId = event && event.data &&
                event.data.centeredNodeId
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
    @inject(TYPES.BranchesStore) public store: Store<any>
    @inject(TYPES.IBindable)
    @tagged(TAGS.DRAG_LISTENER, true)
        public dragListener: IBindable
}
