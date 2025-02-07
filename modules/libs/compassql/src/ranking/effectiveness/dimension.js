import { Scorer } from './base';
import { isFieldQuery, isAutoCountQuery } from '../../query/encoding';
/**
 * Penalize if facet channels are the only dimensions
 */
export class DimensionScorer extends Scorer {
    constructor() {
        super('Dimension');
    }
    initScore() {
        return {
            row: -2,
            column: -2,
            color: 0,
            opacity: 0,
            size: 0,
            shape: 0,
        };
    }
    getScore(specM, _, __) {
        if (specM.isAggregate()) {
            specM.getEncodings().reduce((maxFScore, encQ) => {
                if (isAutoCountQuery(encQ) || (isFieldQuery(encQ) && !encQ.aggregate)) {
                    // isDimension
                    const featureScore = this.getFeatureScore(`${encQ.channel}`);
                    if (featureScore && featureScore.score > maxFScore.score) {
                        return featureScore;
                    }
                }
                return maxFScore;
            }, { type: 'Dimension', feature: 'No Dimension', score: -5 });
        }
        return [];
    }
}
//# sourceMappingURL=dimension.js.map