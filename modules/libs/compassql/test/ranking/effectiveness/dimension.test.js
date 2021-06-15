import { SIZE, COLOR, OPACITY, ROW, COLUMN, SHAPE } from 'vega-lite/build/src/channel';
import { DimensionScorer } from '../../../src/ranking/effectiveness/dimension';
import { testRuleSet } from '../rule';
const scorer = new DimensionScorer();
export const PREFERRED_DIMENSION_RULESET = {
    name: 'dimensionScore',
    rules: [
        {
            name: 'dimensionScore',
            items: [
                [COLOR, SIZE, OPACITY, SHAPE],
                [ROW, COLUMN],
            ],
        },
    ],
};
describe('dimensionScore', () => {
    function getDimensionScore(feature) {
        return scorer.scoreIndex[feature];
    }
    testRuleSet(PREFERRED_DIMENSION_RULESET, getDimensionScore);
});
//# sourceMappingURL=dimension.test.js.map