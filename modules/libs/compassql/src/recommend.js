import { DEFAULT_QUERY_CONFIG } from './config';
import { generate } from './generate';
import { nest } from './nest';
import { normalize } from './query/normalize';
import { rank } from './ranking/ranking';
export function recommend(q, schema, config) {
    // 1. Normalize non-nested `groupBy` to always have `groupBy` inside `nest`
    //    and merge config with the following precedence
    //    query.config > config > DEFAULT_QUERY_CONFIG
    q = Object.assign(Object.assign({}, normalize(q)), { config: Object.assign(Object.assign(Object.assign({}, DEFAULT_QUERY_CONFIG), config), q.config) });
    // 2. Generate
    const answerSet = generate(q.spec, schema, q.config);
    const nestedAnswerSet = nest(answerSet, q.nest);
    const result = rank(nestedAnswerSet, q, schema, 0);
    return {
        query: q,
        result: result,
    };
}
//# sourceMappingURL=recommend.js.map