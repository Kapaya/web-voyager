import { DEFAULT_QUERY_CONFIG } from './config';
import { getEnumerator } from './enumerator';
import { SpecQueryModel } from './model';
import { fromKey } from './property';
import { stylize } from './stylize';
export function generate(specQ, schema, opt = DEFAULT_QUERY_CONFIG) {
    // 1. Build a SpecQueryModel, which also contains wildcardIndex
    const specM = SpecQueryModel.build(specQ, schema, opt);
    const wildcardIndex = specM.wildcardIndex;
    // 2. Enumerate each of the properties based on propPrecedence.
    let answerSet = [specM]; // Initialize Answer Set with only the input spec query.
    opt.propertyPrecedence.forEach((propKey) => {
        const prop = fromKey(propKey);
        // If the original specQuery contains wildcard for this prop
        if (wildcardIndex.hasProperty(prop)) {
            // update answerset
            const enumerator = getEnumerator(prop);
            const reducer = enumerator(wildcardIndex, schema, opt);
            answerSet = answerSet.reduce(reducer, []);
        }
    });
    if (opt.stylize) {
        if (opt.nominalColorScaleForHighCardinality !== null ||
            opt.smallRangeStepForHighCardinalityOrFacet !== null ||
            opt.xAxisOnTopForHighYCardinalityWithoutColumn !== null) {
            return stylize(answerSet, schema, opt);
        }
    }
    return answerSet;
}
//# sourceMappingURL=generate.js.map