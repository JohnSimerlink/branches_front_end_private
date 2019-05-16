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

const PROFICIENCY_NODE_COLOR_MAP = {};
PROFICIENCY_NODE_COLOR_MAP[PROFICIENCIES.UNKNOWN] = UIColor.WHITE;
PROFICIENCY_NODE_COLOR_MAP[PROFICIENCIES.ONE] = UIColor.RED;
PROFICIENCY_NODE_COLOR_MAP[PROFICIENCIES.TWO] = UIColor.ORANGE;
PROFICIENCY_NODE_COLOR_MAP[PROFICIENCIES.THREE] = UIColor.YELLOW;
PROFICIENCY_NODE_COLOR_MAP[PROFICIENCIES.FOUR] = UIColor.LAWNGREEN;

export class ProficiencyUtils {
	/** BECOMING DEPRECATED
	 *
	 * @param proficiency
	 */
	public static getColor(proficiency: PROFICIENCIES): UIColor {
		return PROFICIENCY_NODE_COLOR_MAP[proficiency];
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
