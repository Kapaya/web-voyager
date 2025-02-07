/**
 * Field Type (with Bin and TimeUnit) and Channel Score (Cleveland / Mackinlay based)
 */
import * as CHANNEL from 'vega-lite/build/src/channel';
import { DEFAULT_QUERY_CONFIG } from '../../config';
import { isAutoCountQuery, isFieldQuery } from '../../query/encoding';
import { Scorer } from './base';
import { BIN_Q, getExtendedType, N, O, T, TIMEUNIT_O, TIMEUNIT_T } from './type';
/**
 * Effectiveness Score for preferred axis.
 */
export class AxisScorer extends Scorer {
    constructor() {
        super('Axis');
    }
    initScore(opt = {}) {
        opt = Object.assign(Object.assign({}, DEFAULT_QUERY_CONFIG), opt);
        const score = {};
        const preferredAxes = [
            {
                feature: BIN_Q,
                opt: 'preferredBinAxis',
            },
            {
                feature: T,
                opt: 'preferredTemporalAxis',
            },
            {
                feature: TIMEUNIT_T,
                opt: 'preferredTemporalAxis',
            },
            {
                feature: TIMEUNIT_O,
                opt: 'preferredTemporalAxis',
            },
            {
                feature: O,
                opt: 'preferredOrdinalAxis',
            },
            {
                feature: N,
                opt: 'preferredNominalAxis',
            },
        ];
        preferredAxes.forEach((pAxis) => {
            if (opt[pAxis.opt] === CHANNEL.X) {
                // penalize the other axis
                score[`${pAxis.feature}_${CHANNEL.Y}`] = -0.01;
            }
            else if (opt[pAxis.opt] === CHANNEL.Y) {
                // penalize the other axis
                score[`${pAxis.feature}_${CHANNEL.X}`] = -0.01;
            }
        });
        return score;
    }
    featurize(type, channel) {
        return `${type}_${channel}`;
    }
    getScore(specM, _, __) {
        return specM.getEncodings().reduce((features, encQ) => {
            if (isFieldQuery(encQ) || isAutoCountQuery(encQ)) {
                const type = getExtendedType(encQ);
                const feature = this.featurize(type, encQ.channel);
                const featureScore = this.getFeatureScore(feature);
                if (featureScore) {
                    features.push(featureScore);
                }
            }
            return features;
        }, []);
    }
}
//# sourceMappingURL=axis.js.map