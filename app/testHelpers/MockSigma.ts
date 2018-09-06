import {TYPES} from '../objects/types';
import {inject, injectable, tagged} from 'inversify';
import {TAGS} from '../objects/tags';
import {
	IBindable,
	id,
	ISigma, ISigmaCamera, ISigmaCameraLocation,
	ISigmaEdge,
	ISigmaEdgeData,
	ISigmaFactory,
	ISigmaGraph,
	ISigmaNode,
	ISigmaNodeData,
	ISigmaPlugins
} from '../objects/interfaces';

export class MockSigmaGraph implements ISigmaGraph {
	private _nodes: ISigmaNode[];
	private _edges: ISigmaEdge[];

	constructor(@inject(TYPES.MockSigmaGraphArgs){
		nodes,
		edges,
	}: MockSigmaGraphArgs) {
		this._nodes = nodes;
		this._edges = edges;
	}
	public dropNode(node: ISigmaNodeData) {
	}
	public addNode(node: ISigmaNodeData) {
		const sigmaNode = node as ISigmaNode;
		this._nodes.push(sigmaNode);
	}

	public addEdge(edge: ISigmaEdgeData) {
		const sigmaEdge = edge as ISigmaEdge;
		this._edges.push(sigmaEdge);
	}

	public nodes(id?: id): ISigmaNode & ISigmaNode[] {
		if (id === undefined) {
			return this._nodes as ISigmaNode & ISigmaNode[];
		}
		return this._nodes.filter(n => n.id === id) as ISigmaNode & ISigmaNode[];
	}

	public edges(id?: id): ISigmaEdge[] {
		return this._edges.filter(e => e.id === id);
	}
}

@injectable()
export class MockSigmaGraphArgs {
	@inject(TYPES.Array) public nodes: any[];
	@inject(TYPES.Array) public edges: any[];
}

@injectable()
export class MockSigma implements ISigma {
	public graph: ISigmaGraph;
	public renderers: IBindable[];
	public camera: ISigmaCamera;

	public bind(eventName: string, callback: (event) => void) {
	}

	constructor(@inject(TYPES.MockSigmaArgs){
		graph,
		renderers,
		camera
	}: MockSigmaArgs) {
		this.graph = graph;
		this.renderers = renderers;
		this.camera = camera;
	}
}

@injectable()
export class MockSigmaArgs {
	@inject(TYPES.ISigmaGraph) @tagged(TAGS.TESTING, true)
	public graph: ISigmaGraph;
	@inject(TYPES.ISigmaCamera)
	public camera: ISigmaCamera;
	@inject(TYPES.Array) public renderers: IBindable[];
}

@injectable()
export class MockSigmaFactory implements ISigmaFactory {
	public init() {

	}

	public get plugins(): ISigmaPlugins {
		return {
			tooltips(sigmaInstance, renderer, tooltipsConfig) {
			},
			dragNodes(sigmaInstance, renderer) {
			}
		};
	}

	public create(args: any): ISigma {
		const mockSigmaGraph = new MockSigmaGraph({
			nodes: [],
			edges: []
		});
		const mockSigma = new MockSigma({
			graph: mockSigmaGraph,
			renderers: [],
			camera: {
				goTo(location: ISigmaCameraLocation) {
				},
			}
		});
		return mockSigma;
	}
}
