import { AXIS_PROPERTIES } from 'vega-lite/build/src/axis';
import { LEGEND_PROPERTIES } from 'vega-lite/build/src/legend';
import { SCALE_PROPERTIES } from 'vega-lite/build/src/scale';
import { flagKeys } from './util';
export function isEncodingNestedProp(p) {
    return !!p['parent'];
}
const ENCODING_TOPLEVEL_PROP_INDEX = {
    channel: 1,
    aggregate: 1,
    autoCount: 1,
    bin: 1,
    timeUnit: 1,
    hasFn: 1,
    sort: 1,
    stack: 1,
    field: 1,
    type: 1,
    format: 1,
    scale: 1,
    axis: 1,
    legend: 1,
    value: 1,
};
export const ENCODING_TOPLEVEL_PROPS = flagKeys(ENCODING_TOPLEVEL_PROP_INDEX);
export function isEncodingTopLevelProperty(p) {
    return p.toString() in ENCODING_TOPLEVEL_PROP_INDEX;
}
const ENCODING_NESTED_PROP_PARENT_INDEX = {
    bin: 1,
    scale: 1,
    sort: 1,
    axis: 1,
    legend: 1,
};
export function isEncodingNestedParent(prop) {
    return ENCODING_NESTED_PROP_PARENT_INDEX[prop];
}
// FIXME -- we should not have to manually specify these
export const BIN_CHILD_PROPS = ['maxbins', 'divide', 'extent', 'base', 'step', 'steps', 'minstep'];
export const SORT_CHILD_PROPS = ['field', 'op', 'order'];
const BIN_PROPS = BIN_CHILD_PROPS.map((c) => {
    return { parent: 'bin', child: c };
});
export const SORT_PROPS = SORT_CHILD_PROPS.map((c) => {
    return { parent: 'sort', child: c };
});
export const SCALE_PROPS = SCALE_PROPERTIES.map((c) => {
    return { parent: 'scale', child: c };
});
const AXIS_PROPS = AXIS_PROPERTIES.map((c) => {
    return { parent: 'axis', child: c };
});
const LEGEND_PROPS = LEGEND_PROPERTIES.map((c) => {
    return { parent: 'legend', child: c };
});
export const ENCODING_NESTED_PROPS = [].concat(BIN_PROPS, SORT_PROPS, SCALE_PROPS, AXIS_PROPS, LEGEND_PROPS);
export const VIEW_PROPS = ['width', 'height', 'background', 'padding', 'title'];
const PROP_KEY_DELIMITER = '.';
export function toKey(p) {
    if (isEncodingNestedProp(p)) {
        return p.parent + PROP_KEY_DELIMITER + p.child;
    }
    return p;
}
export function fromKey(k) {
    const split = k.split(PROP_KEY_DELIMITER);
    /* istanbul ignore else */
    if (split.length === 1) {
        return k;
    }
    else if (split.length === 2) {
        return {
            parent: split[0],
            child: split[1],
        };
    }
    else {
        throw `Invalid property key with ${split.length} dots: ${k}`;
    }
}
const ENCODING_NESTED_PROP_INDEX = ENCODING_NESTED_PROPS.reduce((i, prop) => {
    i[prop.parent] = i[prop.parent] || [];
    i[prop.parent][prop.child] = prop;
    return i;
}, {});
// FIXME consider using a more general method
export function getEncodingNestedProp(parent, child) {
    return (ENCODING_NESTED_PROP_INDEX[parent] || {})[child];
}
export function isEncodingProperty(p) {
    return isEncodingTopLevelProperty(p) || isEncodingNestedProp(p);
}
export const ALL_ENCODING_PROPS = [].concat(ENCODING_TOPLEVEL_PROPS, ENCODING_NESTED_PROPS);
export const DEFAULT_PROP_PRECEDENCE = [
    'type',
    'field',
    // Field Transform
    'bin',
    'timeUnit',
    'aggregate',
    'autoCount',
    // Encoding
    'channel',
    // Mark
    'mark',
    'stack',
    'scale',
    'sort',
    'axis',
    'legend',
].concat(BIN_PROPS, SCALE_PROPS, AXIS_PROPS, LEGEND_PROPS, SORT_PROPS);
export var Property;
(function (Property) {
    Property.MARK = 'mark';
    Property.TRANSFORM = 'transform';
    // Layout
    Property.STACK = 'stack';
    Property.FORMAT = 'format';
    // TODO: sub parts of stack
    // Encoding Properties
    Property.CHANNEL = 'channel';
    Property.AGGREGATE = 'aggregate';
    Property.AUTOCOUNT = 'autoCount';
    Property.BIN = 'bin';
    Property.HAS_FN = 'hasFn';
    Property.TIMEUNIT = 'timeUnit';
    Property.FIELD = 'field';
    Property.TYPE = 'type';
    Property.SORT = 'sort';
    Property.SCALE = 'scale';
    Property.AXIS = 'axis';
    Property.LEGEND = 'legend';
    Property.WIDTH = 'width';
    Property.HEIGHT = 'height';
    Property.BACKGROUND = 'background';
    Property.PADDING = 'padding';
    Property.TITLE = 'title';
})(Property || (Property = {}));
//# sourceMappingURL=property.js.map