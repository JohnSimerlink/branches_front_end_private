import {UIColor} from '../uiColor';
import {PROFICIENCIES} from './proficiencyEnum';
import {
	decibels,
	timestamp
} from '../interfaces';
import {
	calculatePercentOpacity,
	colorToRGBA
} from '../sigmaNode/sigmaNodeHelpers';
import {MAP_STATES} from '../mapStateManager/MAP_STATES';

const PROFICIENCY_NODE_COLOR_MAP = {};
PROFICIENCY_NODE_COLOR_MAP[PROFICIENCIES.UNKNOWN] = UIColor.WHITE;
PROFICIENCY_NODE_COLOR_MAP[PROFICIENCIES.ONE] = UIColor.RED;
PROFICIENCY_NODE_COLOR_MAP[PROFICIENCIES.TWO] = UIColor.ORANGE;
PROFICIENCY_NODE_COLOR_MAP[PROFICIENCIES.THREE] = UIColor.YELLOW;
PROFICIENCY_NODE_COLOR_MAP[PROFICIENCIES.FOUR] = UIColor.LAWNGREEN;


const PROFICIENCY_NODE_COLOR_MAP_EDITING_STATE = {};
PROFICIENCY_NODE_COLOR_MAP_EDITING_STATE[PROFICIENCIES.UNKNOWN] = UIColor.FADED_WHITE // UIColor.WHITE;
PROFICIENCY_NODE_COLOR_MAP_EDITING_STATE[PROFICIENCIES.ONE] = UIColor.DARK_RED // .RED;
PROFICIENCY_NODE_COLOR_MAP_EDITING_STATE[PROFICIENCIES.TWO] = UIColor.DARK_ORANGE // UIColor.ORANGE;
PROFICIENCY_NODE_COLOR_MAP_EDITING_STATE[PROFICIENCIES.THREE] = UIColor.DARK_YELLOW // UIColor.YELLOW;
PROFICIENCY_NODE_COLOR_MAP_EDITING_STATE[PROFICIENCIES.FOUR] = UIColor.DARK_GREEN // UIColor.LAWNGREEN;

export class ProficiencyUtils {
	/** BECOMING DEPRECATED
	 *
	 * @param proficiency
	 */
	public static getColor(proficiency: PROFICIENCIES): UIColor {
		return PROFICIENCY_NODE_COLOR_MAP[proficiency];
	}
	public static getColorFromMapState(proficiency: PROFICIENCIES, mapState: MAP_STATES): UIColor {
		switch(mapState) {
			case MAP_STATES.DARK:
				return PROFICIENCY_NODE_COLOR_MAP_EDITING_STATE[proficiency];
				break;
			default:
				return ProficiencyUtils.getColor(proficiency)
		}
	}

	public static getColorFromProficiencyAndForgettingCurve(
		{
			proficiency,
			lastReviewTime,
			lastEstimatedStrength,
			now
		}: {
			proficiency: PROFICIENCIES,
			lastReviewTime: timestamp,
			lastEstimatedStrength: decibels,
			now: timestamp
		}
	) {
		const opacity = calculatePercentOpacity({
			lastReviewTime,
			lastEstimatedStrength,
			now
		})
		const [r, g, b] = colorToRGBA(ProficiencyUtils.getColor(proficiency))
		return `rgba(${r}, ${g}, ${b}, ${opacity})`
	}
}
