import {inject, injectable} from 'inversify';
import {isMobile} from '../../core/utils';
import {TYPES} from '../types';
import {ISigmaNodeData, ITooltipConfigurer} from '../interfaces';
import {log} from '../../core/log';
import {Store} from 'vuex';
import {getContentUserId} from '../../loaders/contentUser/ContentUserLoaderUtils';

export function escape(str) {
	if (!str) {
		return '';
	}
	return encodeURIComponent(JSON.stringify(str));
}

/* If we ever have a feature where someone can essentially masquerade
 as another user and open a tooltip with a different userId,
 we will have to instantiate another tooltipOpener branchesMap */
@injectable()
export class TooltipConfigurer implements ITooltipConfigurer {
	private store: Store<any>;

	constructor(@inject(TYPES.TooltipConfigurerArgs){store}: TooltipConfigurerArgs) {
		this.store = store;
		// TODO: maybe set up this watch outside of constructor?
	}

	private userId(): string {
		return this.store.state.userId;
	}

	private renderer(node: ISigmaNodeData, template): string {
		const contentId = node.contentId;
		const userId = this.userId();
		const contentUserId = getContentUserId({contentId, userId});
		const contentString = JSON.stringify(node.content);
		const contentUserDataString = node.contentUserData ?
			JSON.stringify(node.contentUserData) : '';
		const resultElement = document.createElement('div');
		resultElement.setAttribute('id', 'vue');
		const tree = document.createElement('tree');
		tree.setAttribute('id', node.id);
		tree.setAttribute('parent-id', node.parentId);
		tree.setAttribute('content-id', node.contentId);
		tree.setAttribute('content-string', contentString);
		tree.setAttribute('content-user-id', contentUserId);
		tree.setAttribute('content-user-data-string', contentUserDataString);
		resultElement.appendChild(tree);
		const result: string = resultElement.outerHTML;

		return result;
	}

	private hoverRenderer(node: ISigmaNodeData, template): string {
		const contentId = node.contentId;
		const userId = this.userId();
		const contentUserId = getContentUserId({contentId, userId});
		const contentString = JSON.stringify(node.content);
		const contentUserDataString = node.contentUserData ?
			JSON.stringify(node.contentUserData) : '';
		const resultElement = document.createElement('div');
		resultElement.setAttribute('id', 'vue');
		const nodeHoverIcons = document.createElement('node-hover-icons');
		nodeHoverIcons.setAttribute('id', node.id);
		nodeHoverIcons.setAttribute('parent-id', node.parentId);
		nodeHoverIcons.setAttribute('content-id', node.contentId);
		nodeHoverIcons.setAttribute('content-string', contentString);
		nodeHoverIcons.setAttribute('content-user-id', contentUserId);
		nodeHoverIcons.setAttribute('content-user-data-string', contentUserDataString);
		resultElement.appendChild(nodeHoverIcons);
		const result: string = resultElement.outerHTML;

		return result;

	}

	public getTooltipsConfig() {
		const tooltipsConfig = {
			node: [
				{
					show: 'rightClickNode',
					cssClass: 'sigma-tooltip',
					position: 'center',
					template: '',
					renderer: this.renderer.bind(this)
				}],
		};
		return tooltipsConfig;
	}
	public getHovererTooltipsConfig() {
		const tooltipsConfig = {
			node: [
				{
					show: 'rightClickNode',
					cssClass: 'sigma-tooltip',
					position: 'circular',
					template: '',
					renderer: this.hoverRenderer.bind(this)
				}],
		};
		return tooltipsConfig;
	}
}

@injectable()
export class TooltipConfigurerArgs {
	@inject(TYPES.Object) public store;
}
