export const GLOBAL_MAP_ID: string = '1';
export const GLOBAL_MAP_ROOT_TREE_ID: string = '1';
import * as firebase from 'firebase';
import {koalaURL} from '../koalaUrl';

export const GLOBAL_BACKGROUND_COLOR = '#00b4ff'
export const DEFAULT_JUMP_TO_ZOOM_RATIO: number = .02;
export const MAP_DEFAULT_X: number = 0;
export const MAP_DEFAULT_Y: number = 0;
export const DEFAULT_MAP_ID: string = GLOBAL_MAP_ID;
export const NON_EXISTENT_ID: string = 'nothing';
export const ROOT_CONTENT_ID: string = '8904d53adfef7376627f4227ada47cd8';
export const INITIAL_TREE_ID_TO_DOWNLOAD: string = GLOBAL_MAP_ROOT_TREE_ID;
export const ANOTHER_ID: string = '0544dddbb98b36dd9328eb71ba938465';
export const ANOTHER_CONTENT_ID: string = '6cc727081ac4baa0e9a08dfb034698b8';
export const JOHN_USER_ID: string = 'svyioFSkuqPTf1gjmHYGIsi42IA3';
export const RENDERER_PREFIX = 'renderer2:';
export const DEFAULT_FONT_SIZE = 24;
export const DEFAULT_EDGE_SIZE = 0.5;
export const DEFAULT_NEW_TREE_POINTS = 10;
export const DEFAULT_NODE_SIZE = 2;
export const COMBINED_ID_SEPARATOR = '__';
export const DEFAULT_USER_INFO: firebase.UserInfo = {
	displayName: 'Display Name',
	email: 'email@email.com',
	phoneNumber: '513-111-1111',
	photoURL: koalaURL,
	providerId: 'providerId',
	uid: 'user id'
};
export const GRAPH_CONTAINER_ID = 'graph-container';
export const NODE_TYPES = {
	SHADOW_NODE: 9100,
	TREE: 'tree',
};

export const EDGE_TYPES = {
	SUGGESTED_CONNECTION: 9001,
	HIERARCHICAL: 9002,
};

function requireBothWays(importIdentifier) {
	const requiredValue = require(importIdentifier)
	const output = requiredValue.default || requiredValue
	return output
}
