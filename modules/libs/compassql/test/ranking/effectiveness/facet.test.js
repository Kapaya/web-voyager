import { ROW, COLUMN } from 'vega-lite/build/src/channel';
import { FacetScorer } from '../../../src/ranking/effectiveness/facet';
import { testRuleSet } from '../rule';
const scorer = new FacetScorer();
export const PREFERRED_FACET_RULESET = {
    name: 'preferredFacetScore',
    rules: [
        {
            name: 'preferredFacetScore',
            items: [ROW, COLUMN],
        },
    ],
};
describe('preferredFacetScore', () => {
    function getPreferredFacetScore(feature) {
        return scorer.scoreIndex[feature];
    }
    testRuleSet(PREFERRED_FACET_RULESET, getPreferredFacetScore);
});
//# sourceMappingURL=facet.test.js.map