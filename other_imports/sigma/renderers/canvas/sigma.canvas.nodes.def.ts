import sigmaConstructorUntyped
	from '../../sigma.core';
import {ProficiencyUtils} from '../../../../app/objects/proficiency/ProficiencyUtils';
import {PROFICIENCIES} from '../../../../app/objects/proficiency/proficiencyEnum';
import {
	calculateCardDimensions,
	calculateCardHeight,
	calculateCardWidth,
	calculateStartXY
} from './cardDimensions';
import {
	ISigma,
	ISigmaConstructor,
	ISigmaNode
} from '../../../../app/objects/interfaces';
import {
	DEFAULT_BORDER_RADIUS,
	TERTIARY_COLOR
} from '../../../../app/core/globals';
import {
	calcHeight,
	calculateFlashcardPaddingFromNodeSize,
	calculateLabelLineHeightFromNodeSize,
	getDimensions
} from './getDimensions';
import {wrapText} from './wrapText';
import {MAP_STATES} from '../../../../app/objects/mapStateManager/MAP_STATES';
import {mainModeNodeRenderer} from './canvasNodeRendererHellpers';

const sigmaConstructor: ISigmaConstructor = sigmaConstructorUntyped as unknown as ISigmaConstructor;
const sigma = sigmaConstructor

// TODO: change all these sigmaConstructor files to TS files
const NODE_TYPES = {
	SHADOW_NODE: 9100,
};

const Globals = {
	currentTreeSelected: null,
	colors: {
		proficiency_4: 'lawngreen',
		proficiency_3: 'yellow',
		proficiency_2: 'orange',
		proficiency_1: 'red',
		proficiency_unknown: 'gray',
	},
	overdueSize: 2,
	regularSize: 1,
};

function proficiencyToColor(proficiency) {
	if (proficiency > PROFICIENCIES.THREE) {
		return Globals.colors.proficiency_4;
	}
	if (proficiency > PROFICIENCIES.TWO) {
		return Globals.colors.proficiency_3;
	}
	if (proficiency > PROFICIENCIES.ONE) {
		return Globals.colors.proficiency_2;
	}
	if (proficiency > PROFICIENCIES.UNKNOWN) {
		return Globals.colors.proficiency_1;
	}
	return Globals.colors.proficiency_unknown;
}

console.log('sigma canvas nodes def sigmaConstructor is', sigmaConstructor, Object.keys(sigmaConstructor))
sigmaConstructor.utils.pkg('sigma.canvas.nodes');

/**
 * The default node renderer. It renders the node as a simple disc.
 *
 * @param  {object}                   node     The node object.
 * @param  {CanvasRenderingContext2D} context  The canvas context.
 * @param  {configurable}             settings The settings function.
 */
sigmaConstructor.canvas.nodes.def = mainModeNodeRenderer // (node, context, settings) => {
// TODO: note: this file's code is dangerous, because it is procedural. I had a pesky race condition issue where I was importing a function exported by this file, before one of the objects in this file (sigmaConstructor.utils) had been created, because that object gets created by another file, which hadn't yet been imported when this was being imported. moral of the story: procedural code can lead to race conditions when importing (parts of) a procedural file in multiple places
	// // console.log("canvas nodes def called", node, context, settings)
	// if (node.type === NODE_TYPES.SHADOW_NODE) {
	// 	return;
	// }
// 	drawNodeWithText(node, context, settings);
// };

