import { Scorer } from './base';
import { isFieldQuery, isAutoCountQuery } from '../../query/encoding';
/**
 * Effectivenss score that penalize size for bar and tick
 */
export class SizeChannelScorer extends Scorer {
    constructor() {
        super('SizeChannel');
    }
    initScore() {
        return {
            bar_size: -2,
            tick_size: -2,
        };
    }
    getScore(specM, _, __) {
        const mark = specM.getMark();
        return specM.getEncodings().reduce((featureScores, encQ) => {
            if (isFieldQuery(encQ) || isAutoCountQuery(encQ)) {
                const feature = `${mark}_${encQ.channel}`;
                const featureScore = this.getFeatureScore(feature);
                if (featureScore) {
                    featureScores.push(featureScore);
                }
            }
            return featureScores;
        }, []);
    }
}
//# sourceMappingURL=sizechannel.js.map