import { fieldDef as fieldDefShorthand } from '../../query/shorthand';
import { isFieldQuery, isAutoCountQuery } from '../../query/encoding';
import { extend, forEach, keys, contains } from '../../util';
import { BIN_Q, TIMEUNIT_T, TIMEUNIT_O, Q, N, O, T, getExtendedType, K } from './type';
import { Scorer } from './base';
export const TERRIBLE = -10;
/**
 * Effectiveness score for relationship between
 * Field Type (with Bin and TimeUnit) and Channel Score (Cleveland / Mackinlay based)
 */
export class TypeChannelScorer extends Scorer {
    constructor() {
        super('TypeChannel');
    }
    initScore() {
        const SCORE = {};
        // Continuous Quantitative / Temporal Fields
        const CONTINUOUS_TYPE_CHANNEL_SCORE = {
            x: 0,
            y: 0,
            size: -0.575,
            color: -0.725,
            text: -2,
            opacity: -3,
            shape: TERRIBLE,
            row: TERRIBLE,
            column: TERRIBLE,
            detail: 2 * TERRIBLE,
        };
        [Q, T, TIMEUNIT_T].forEach((type) => {
            keys(CONTINUOUS_TYPE_CHANNEL_SCORE).forEach((channel) => {
                SCORE[this.featurize(type, channel)] = CONTINUOUS_TYPE_CHANNEL_SCORE[channel];
            });
        });
        // Discretized Quantitative / Temporal Fields / Ordinal
        const ORDERED_TYPE_CHANNEL_SCORE = extend({}, CONTINUOUS_TYPE_CHANNEL_SCORE, {
            row: -0.75,
            column: -0.75,
            shape: -3.1,
            text: -3.2,
            detail: -4,
        });
        [BIN_Q, TIMEUNIT_O, O].forEach((type) => {
            keys(ORDERED_TYPE_CHANNEL_SCORE).forEach((channel) => {
                SCORE[this.featurize(type, channel)] = ORDERED_TYPE_CHANNEL_SCORE[channel];
            });
        });
        const NOMINAL_TYPE_CHANNEL_SCORE = {
            x: 0,
            y: 0,
            color: -0.6,
            shape: -0.65,
            row: -0.7,
            column: -0.7,
            text: -0.8,
            detail: -2,
            size: -3,
            opacity: -3.1,
        };
        keys(NOMINAL_TYPE_CHANNEL_SCORE).forEach((channel) => {
            SCORE[this.featurize(N, channel)] = NOMINAL_TYPE_CHANNEL_SCORE[channel];
            SCORE[this.featurize(K, channel)] =
                // Putting key on position or detail isn't terrible
                contains(['x', 'y', 'detail'], channel) ? -1 : NOMINAL_TYPE_CHANNEL_SCORE[channel] - 2;
        });
        return SCORE;
    }
    featurize(type, channel) {
        return `${type}_${channel}`;
    }
    getScore(specM, schema, opt) {
        const encodingQueryByField = specM.getEncodings().reduce((m, encQ) => {
            if (isFieldQuery(encQ) || isAutoCountQuery(encQ)) {
                const fieldKey = fieldDefShorthand(encQ);
                (m[fieldKey] = m[fieldKey] || []).push(encQ);
            }
            return m;
        }, {});
        const features = [];
        forEach(encodingQueryByField, (encQs) => {
            const bestFieldFeature = encQs.reduce((best, encQ) => {
                if (isFieldQuery(encQ) || isAutoCountQuery(encQ)) {
                    const type = getExtendedType(encQ);
                    const feature = this.featurize(type, encQ.channel);
                    const featureScore = this.getFeatureScore(feature);
                    if (best === null || featureScore.score > best.score) {
                        return featureScore;
                    }
                }
                return best;
            }, null);
            features.push(bestFieldFeature);
            // TODO: add plus for over-encoding of one field
        });
        return features;
    }
}
//# sourceMappingURL=typechannel.js.map