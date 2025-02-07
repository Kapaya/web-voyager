import { isArray } from 'datalib/src/util';
import { Property } from './property';
import { PropIndex } from './propindex';
import { GROUP_BY_ENCODING, GROUP_BY_FIELD_TRANSFORM, parseGroupBy } from './query/groupby';
import { spec as specShorthand } from './query/shorthand';
/**
 * Registry for all possible grouping key functions.
 */
const groupRegistry = {};
/**
 * Add a grouping function to the registry.
 */
export function registerKeyFn(name, keyFn) {
    groupRegistry[name] = keyFn;
}
export const FIELD = 'field';
export const FIELD_TRANSFORM = 'fieldTransform';
export const ENCODING = 'encoding';
export const SPEC = 'spec';
/**
 * Group the input spec query model by a key function registered in the group registry
 * @return
 */
export function nest(specModels, queryNest) {
    if (queryNest) {
        const rootGroup = {
            name: '',
            path: '',
            items: [],
        };
        const groupIndex = {};
        // global `includes` and `replaces` will get augmented by each level's groupBy.
        // Upper level's `groupBy` will get cascaded to lower-level groupBy.
        // `replace` can be overriden in a lower-level to support different grouping.
        const includes = [];
        const replaces = [];
        const replacers = [];
        for (let l = 0; l < queryNest.length; l++) {
            includes.push(l > 0 ? includes[l - 1].duplicate() : new PropIndex());
            replaces.push(l > 0 ? replaces[l - 1].duplicate() : new PropIndex());
            const groupBy = queryNest[l].groupBy;
            if (isArray(groupBy)) {
                // If group is array, it's an array of extended group by that need to be parsed
                const parsedGroupBy = parseGroupBy(groupBy, includes[l], replaces[l]);
                replacers.push(parsedGroupBy.replacer);
            }
        }
        // With includes and replacers, now we can construct the nesting tree
        specModels.forEach((specM) => {
            let path = '';
            let group = rootGroup;
            for (let l = 0; l < queryNest.length; l++) {
                const groupBy = (group.groupBy = queryNest[l].groupBy);
                group.orderGroupBy = queryNest[l].orderGroupBy;
                const key = isArray(groupBy)
                    ? specShorthand(specM.specQuery, includes[l], replacers[l])
                    : groupRegistry[groupBy](specM.specQuery);
                path += `/${key}`;
                if (!groupIndex[path]) {
                    // this item already exists on the path
                    groupIndex[path] = {
                        name: key,
                        path: path,
                        items: [],
                    };
                    group.items.push(groupIndex[path]);
                }
                group = groupIndex[path];
            }
            group.items.push(specM);
        });
        return rootGroup;
    }
    else {
        // no nesting, just return a flat group
        return {
            name: '',
            path: '',
            items: specModels,
        };
    }
}
// TODO: move this to groupBy, rename properly, and export
const GROUP_BY_FIELD = [Property.FIELD];
const PARSED_GROUP_BY_FIELD = parseGroupBy(GROUP_BY_FIELD);
export function getGroupByKey(specM, groupBy) {
    return groupRegistry[groupBy](specM);
}
registerKeyFn(FIELD, (specQ) => {
    return specShorthand(specQ, PARSED_GROUP_BY_FIELD.include, PARSED_GROUP_BY_FIELD.replacer);
});
export const PARSED_GROUP_BY_FIELD_TRANSFORM = parseGroupBy(GROUP_BY_FIELD_TRANSFORM);
registerKeyFn(FIELD_TRANSFORM, (specQ) => {
    return specShorthand(specQ, PARSED_GROUP_BY_FIELD_TRANSFORM.include, PARSED_GROUP_BY_FIELD_TRANSFORM.replacer);
});
export const PARSED_GROUP_BY_ENCODING = parseGroupBy(GROUP_BY_ENCODING);
registerKeyFn(ENCODING, (specQ) => {
    return specShorthand(specQ, PARSED_GROUP_BY_ENCODING.include, PARSED_GROUP_BY_ENCODING.replacer);
});
registerKeyFn(SPEC, (specQ) => JSON.stringify(specQ));
//# sourceMappingURL=nest.js.map