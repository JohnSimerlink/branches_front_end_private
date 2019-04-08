import {IContentUserData} from '../interfaces';
import {DEFAULT_NODE_SIZE} from '../../core/globals';

export class ContentUserDataUtils {
	public static getSizeFromContentUserData(userContentData: IContentUserData) {
		return userContentData.lastEstimatedStrength ? size(userContentData.lastEstimatedStrength) : DEFAULT_NODE_SIZE;
	}
}

function size(strength: number): number {
	// return strength / 30 + 1;
	return DEFAULT_NODE_SIZE;
}

function sigmoid(x: number): number {
	return 1 / (1 + Math.exp(-1 * x));
}
