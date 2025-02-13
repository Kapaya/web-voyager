import * as CHANNEL from 'vega-lite/build/src/channel';
import { DEFAULT_QUERY_CONFIG } from '../../config';
import { isAutoCountQuery, isFieldQuery } from '../../query/encoding';
import { Scorer } from './base';
/**
 * Effective Score for preferred facet
 */
export class FacetScorer extends Scorer {
    constructor() {
        super('Facet');
    }
    initScore(opt) {
        opt = Object.assign(Object.assign({}, DEFAULT_QUERY_CONFIG), opt);
        const score = {};
        if (opt.preferredFacet === CHANNEL.ROW) {
            // penalize the other axis
            score[CHANNEL.COLUMN] = -0.01;
        }
        else if (opt.preferredFacet === CHANNEL.COLUMN) {
            // penalize the other axis
            score[CHANNEL.ROW] = -0.01;
        }
        return score;
    }
    getScore(specM, _, __) {
        return specM.getEncodings().reduce((features, encQ) => {
            if (isFieldQuery(encQ) || isAutoCountQuery(encQ)) {
                const featureScore = this.getFeatureScore(encQ.channel);
                if (featureScore) {
                    features.push(featureScore);
                }
            }
            return features;
        }, []);
    }
}
//# sourceMappingURL=facet.js.map