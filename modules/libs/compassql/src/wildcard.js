import { AXIS_PROPERTIES } from 'vega-lite/build/src/axis';
import { COLOR, COLUMN, ROW, SIZE, X, Y } from 'vega-lite/build/src/channel';
import { LEGEND_PROPERTIES } from 'vega-lite/build/src/legend';
import * as MARK from 'vega-lite/build/src/mark';
import { ScaleType, SCALE_PROPERTIES } from 'vega-lite/build/src/scale';
import * as TYPE from 'vega-lite/build/src/type';
import { isEncodingNestedProp } from './property';
import { extend, isArray } from './util';
export const SHORT_WILDCARD = '?';
export function isWildcard(prop) {
    return isShortWildcard(prop) || isWildcardDef(prop);
}
export function isShortWildcard(prop) {
    return prop === SHORT_WILDCARD;
}
export function isWildcardDef(prop) {
    return prop !== undefined && prop != null && (!!prop.enum || !!prop.name) && !isArray(prop);
}
export function initWildcard(prop, defaultName, defaultEnumValues) {
    return extend({}, {
        name: defaultName,
        enum: defaultEnumValues,
    }, prop === SHORT_WILDCARD ? {} : prop);
}
/**
 * Initial short names from list of full camelCaseNames.
 * For each camelCaseNames, return unique short names based on initial (e.g., `ccn`)
 */
function initNestedPropName(fullNames) {
    const index = {};
    const has = {};
    for (const fullName of fullNames) {
        const initialIndices = [0];
        for (let i = 0; i < fullName.length; i++) {
            if (fullName.charAt(i).toUpperCase() === fullName.charAt(i)) {
                initialIndices.push(i);
            }
        }
        let shortName = initialIndices
            .map((i) => fullName.charAt(i))
            .join('')
            .toLowerCase();
        if (!has[shortName]) {
            index[fullName] = shortName;
            has[shortName] = true;
            continue;
        }
        // If duplicate, add last character and try again!
        if (initialIndices[initialIndices.length - 1] !== fullName.length - 1) {
            shortName = initialIndices
                .concat([fullName.length - 1])
                .map((i) => fullName.charAt(i))
                .join('')
                .toLowerCase();
            if (!has[shortName]) {
                index[fullName] = shortName;
                has[shortName] = true;
                continue;
            }
        }
        for (let i = 1; !index[fullName]; i++) {
            const shortNameWithNo = `${shortName}_${i}`;
            if (!has[shortNameWithNo]) {
                index[fullName] = shortNameWithNo;
                has[shortNameWithNo] = true;
                break;
            }
        }
    }
    return index;
}
export const DEFAULT_NAME = {
    mark: 'm',
    channel: 'c',
    aggregate: 'a',
    autoCount: '#',
    hasFn: 'h',
    bin: 'b',
    sort: 'so',
    stack: 'st',
    scale: 's',
    format: 'f',
    axis: 'ax',
    legend: 'l',
    value: 'v',
    timeUnit: 'tu',
    field: 'f',
    type: 't',
    binProps: {
        maxbins: 'mb',
        min: 'mi',
        max: 'ma',
        base: 'b',
        step: 's',
        steps: 'ss',
        minstep: 'ms',
        divide: 'd',
    },
    sortProps: {
        field: 'f',
        op: 'o',
        order: 'or',
    },
    scaleProps: initNestedPropName(SCALE_PROPERTIES),
    axisProps: initNestedPropName(AXIS_PROPERTIES),
    legendProps: initNestedPropName(LEGEND_PROPERTIES),
};
export function getDefaultName(prop) {
    if (isEncodingNestedProp(prop)) {
        return `${DEFAULT_NAME[prop.parent]}-${DEFAULT_NAME[`${prop.parent}Props`][prop.child]}`;
    }
    if (DEFAULT_NAME[prop]) {
        return DEFAULT_NAME[prop];
    }
    /* istanbul ignore next */
    throw new Error(`Default name undefined for ${prop}`);
}
const DEFAULT_BOOLEAN_ENUM = [false, true];
const DEFAULT_BIN_PROPS_ENUM = {
    maxbins: [5, 10, 20],
    extent: [undefined],
    base: [10],
    step: [undefined],
    steps: [undefined],
    minstep: [undefined],
    divide: [[5, 2]],
    binned: [false],
    anchor: [undefined],
    nice: [true],
};
const DEFAULT_SORT_PROPS = {
    field: [undefined],
    op: ['min', 'mean'],
    order: ['ascending', 'descending'],
};
const DEFAULT_SCALE_PROPS_ENUM = {
    align: [undefined],
    type: [undefined, ScaleType.LOG],
    domain: [undefined],
    domainMax: [undefined],
    domainMid: [undefined],
    domainMin: [undefined],
    base: [undefined],
    exponent: [1, 2],
    constant: [undefined],
    bins: [undefined],
    clamp: DEFAULT_BOOLEAN_ENUM,
    nice: DEFAULT_BOOLEAN_ENUM,
    reverse: DEFAULT_BOOLEAN_ENUM,
    round: DEFAULT_BOOLEAN_ENUM,
    zero: DEFAULT_BOOLEAN_ENUM,
    padding: [undefined],
    paddingInner: [undefined],
    paddingOuter: [undefined],
    interpolate: [undefined],
    range: [undefined],
    rangeMax: [undefined],
    rangeMin: [undefined],
    scheme: [undefined],
};
const DEFAULT_AXIS_PROPS_ENUM = {
    aria: [undefined],
    description: [undefined],
    zindex: [1, 0],
    offset: [undefined],
    orient: [undefined],
    values: [undefined],
    bandPosition: [undefined],
    encoding: [undefined],
    domain: DEFAULT_BOOLEAN_ENUM,
    domainCap: [undefined],
    domainColor: [undefined],
    domainDash: [undefined],
    domainDashOffset: [undefined],
    domainOpacity: [undefined],
    domainWidth: [undefined],
    formatType: [undefined],
    grid: DEFAULT_BOOLEAN_ENUM,
    gridCap: [undefined],
    gridColor: [undefined],
    gridDash: [undefined],
    gridDashOffset: [undefined],
    gridOpacity: [undefined],
    gridWidth: [undefined],
    format: [undefined],
    labels: DEFAULT_BOOLEAN_ENUM,
    labelAlign: [undefined],
    labelAngle: [undefined],
    labelBaseline: [undefined],
    labelColor: [undefined],
    labelExpr: [undefined],
    labelFlushOffset: [undefined],
    labelFont: [undefined],
    labelFontSize: [undefined],
    labelFontStyle: [undefined],
    labelFontWeight: [undefined],
    labelLimit: [undefined],
    labelLineHeight: [undefined],
    labelOffset: [undefined],
    labelOpacity: [undefined],
    labelSeparation: [undefined],
    labelOverlap: [undefined],
    labelPadding: [undefined],
    labelBound: [undefined],
    labelFlush: [undefined],
    maxExtent: [undefined],
    minExtent: [undefined],
    position: [undefined],
    style: [undefined],
    ticks: DEFAULT_BOOLEAN_ENUM,
    tickBand: [undefined],
    tickCap: [undefined],
    tickColor: [undefined],
    tickCount: [undefined],
    tickDash: [undefined],
    tickExtra: [undefined],
    tickDashOffset: [undefined],
    tickMinStep: [undefined],
    tickOffset: [undefined],
    tickOpacity: [undefined],
    tickRound: [undefined],
    tickSize: [undefined],
    tickWidth: [undefined],
    title: [undefined],
    titleAlign: [undefined],
    titleAnchor: [undefined],
    titleAngle: [undefined],
    titleBaseline: [undefined],
    titleColor: [undefined],
    titleFont: [undefined],
    titleFontSize: [undefined],
    titleFontStyle: [undefined],
    titleFontWeight: [undefined],
    titleLimit: [undefined],
    titleLineHeight: [undefined],
    titleOpacity: [undefined],
    titlePadding: [undefined],
    titleX: [undefined],
    titleY: [undefined],
    translate: [undefined],
};
const DEFAULT_LEGEND_PROPS_ENUM = {
    aria: [undefined],
    description: [undefined],
    orient: ['left', 'right'],
    format: [undefined],
    type: [undefined],
    values: [undefined],
    zindex: [undefined],
    clipHeight: [undefined],
    columnPadding: [undefined],
    columns: [undefined],
    cornerRadius: [undefined],
    direction: [undefined],
    encoding: [undefined],
    fillColor: [undefined],
    formatType: [undefined],
    gridAlign: [undefined],
    offset: [undefined],
    padding: [undefined],
    rowPadding: [undefined],
    strokeColor: [undefined],
    labelAlign: [undefined],
    labelBaseline: [undefined],
    labelColor: [undefined],
    labelExpr: [undefined],
    labelFont: [undefined],
    labelFontSize: [undefined],
    labelFontStyle: [undefined],
    labelFontWeight: [undefined],
    labelLimit: [undefined],
    labelOffset: [undefined],
    labelOpacity: [undefined],
    labelOverlap: [undefined],
    labelPadding: [undefined],
    labelSeparation: [undefined],
    legendX: [undefined],
    legendY: [undefined],
    gradientLength: [undefined],
    gradientOpacity: [undefined],
    gradientStrokeColor: [undefined],
    gradientStrokeWidth: [undefined],
    gradientThickness: [undefined],
    symbolDash: [undefined],
    symbolDashOffset: [undefined],
    symbolFillColor: [undefined],
    symbolLimit: [undefined],
    symbolOffset: [undefined],
    symbolOpacity: [undefined],
    symbolSize: [undefined],
    symbolStrokeColor: [undefined],
    symbolStrokeWidth: [undefined],
    symbolType: [undefined],
    tickCount: [undefined],
    tickMinStep: [undefined],
    title: [undefined],
    titleAnchor: [undefined],
    titleAlign: [undefined],
    titleBaseline: [undefined],
    titleColor: [undefined],
    titleFont: [undefined],
    titleFontSize: [undefined],
    titleFontStyle: [undefined],
    titleFontWeight: [undefined],
    titleLimit: [undefined],
    titleLineHeight: [undefined],
    titleOpacity: [undefined],
    titleOrient: [undefined],
    titlePadding: [undefined],
};
// Use FullEnumIndex to make sure we have all properties specified here!
export const DEFAULT_ENUM_INDEX = {
    mark: [MARK.POINT, MARK.BAR, MARK.LINE, MARK.AREA, MARK.RECT, MARK.TICK, MARK.TEXT],
    channel: [X, Y, ROW, COLUMN, SIZE, COLOR],
    band: [undefined],
    aggregate: [undefined, 'mean'],
    autoCount: DEFAULT_BOOLEAN_ENUM,
    bin: DEFAULT_BOOLEAN_ENUM,
    hasFn: DEFAULT_BOOLEAN_ENUM,
    timeUnit: [undefined, 'year', 'month', 'minutes', 'seconds'],
    field: [undefined],
    type: [TYPE.NOMINAL, TYPE.ORDINAL, TYPE.QUANTITATIVE, TYPE.TEMPORAL],
    sort: ['ascending', 'descending'],
    stack: ['zero', 'normalize', 'center', null],
    value: [undefined],
    format: [undefined],
    title: [undefined],
    scale: [true],
    axis: DEFAULT_BOOLEAN_ENUM,
    legend: DEFAULT_BOOLEAN_ENUM,
    binProps: DEFAULT_BIN_PROPS_ENUM,
    sortProps: DEFAULT_SORT_PROPS,
    scaleProps: DEFAULT_SCALE_PROPS_ENUM,
    axisProps: DEFAULT_AXIS_PROPS_ENUM,
    legendProps: DEFAULT_LEGEND_PROPS_ENUM,
};
// TODO: rename this to getDefaultEnum
export function getDefaultEnumValues(prop, schema, opt) {
    if (prop === 'field' || (isEncodingNestedProp(prop) && prop.parent === 'sort' && prop.child === 'field')) {
        // For field, by default enumerate all fields
        return schema.fieldNames();
    }
    let val;
    if (isEncodingNestedProp(prop)) {
        val = opt.enum[`${prop.parent}Props`][prop.child];
    }
    else {
        val = opt.enum[prop];
    }
    if (val !== undefined) {
        return val;
    }
    /* istanbul ignore next */
    throw new Error(`No default enumValues for ${JSON.stringify(prop)}`);
}
//# sourceMappingURL=wildcard.js.map