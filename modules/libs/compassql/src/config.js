import * as CHANNEL from 'vega-lite/build/src/channel';
import { DEFAULT_PROP_PRECEDENCE, toKey } from './property';
import { DEFAULT_ENUM_INDEX } from './wildcard';
export const DEFAULT_QUERY_CONFIG = {
    verbose: false,
    defaultSpecConfig: {
        line: { point: true },
        scale: { useUnaggregatedDomain: true },
    },
    propertyPrecedence: DEFAULT_PROP_PRECEDENCE.map(toKey),
    enum: DEFAULT_ENUM_INDEX,
    numberNominalProportion: 0.05,
    numberNominalLimit: 40,
    // CONSTRAINTS
    constraintManuallySpecifiedValue: false,
    // Spec Constraints -- See description inside src/constraints/spec.ts
    autoAddCount: false,
    hasAppropriateGraphicTypeForMark: true,
    omitAggregate: false,
    omitAggregatePlotWithDimensionOnlyOnFacet: true,
    omitAggregatePlotWithoutDimension: false,
    omitBarLineAreaWithOcclusion: true,
    omitBarTickWithSize: true,
    omitMultipleNonPositionalChannels: true,
    omitRaw: false,
    omitRawContinuousFieldForAggregatePlot: true,
    omitRepeatedField: true,
    omitNonPositionalOrFacetOverPositionalChannels: true,
    omitTableWithOcclusionIfAutoAddCount: true,
    omitVerticalDotPlot: false,
    omitInvalidStackSpec: true,
    omitNonSumStack: true,
    preferredBinAxis: CHANNEL.X,
    preferredTemporalAxis: CHANNEL.X,
    preferredOrdinalAxis: CHANNEL.Y,
    preferredNominalAxis: CHANNEL.Y,
    preferredFacet: CHANNEL.ROW,
    // Field Encoding Constraints -- See description inside src/constraint/field.ts
    minCardinalityForBin: 15,
    maxCardinalityForCategoricalColor: 20,
    maxCardinalityForFacet: 20,
    maxCardinalityForShape: 6,
    timeUnitShouldHaveVariation: true,
    typeMatchesSchemaType: true,
    // STYLIZE
    stylize: true,
    smallRangeStepForHighCardinalityOrFacet: { maxCardinality: 10, rangeStep: 12 },
    nominalColorScaleForHighCardinality: { maxCardinality: 10, palette: 'category20' },
    xAxisOnTopForHighYCardinalityWithoutColumn: { maxCardinality: 30 },
    // RANKING PREFERENCE
    maxGoodCardinalityForFacet: 5,
    maxGoodCardinalityForColor: 7,
    // HIGH CARDINALITY STRINGS
    minPercentUniqueForKey: 0.8,
    minCardinalityForKey: 50,
};
export function extendConfig(opt) {
    return Object.assign(Object.assign(Object.assign({}, DEFAULT_QUERY_CONFIG), opt), { enum: extendEnumIndex(opt.enum) });
}
function extendEnumIndex(enumIndex) {
    const enumOpt = Object.assign(Object.assign(Object.assign({}, DEFAULT_ENUM_INDEX), enumIndex), { binProps: extendNestedEnumIndex(enumIndex, 'bin'), scaleProps: extendNestedEnumIndex(enumIndex, 'scale'), axisProps: extendNestedEnumIndex(enumIndex, 'axis'), legendProps: extendNestedEnumIndex(enumIndex, 'legend') });
    return enumOpt;
}
function extendNestedEnumIndex(enumIndex, prop) {
    return Object.assign(Object.assign({}, DEFAULT_ENUM_INDEX[`${prop}Props`]), enumIndex[`${prop}Props`]);
}
//# sourceMappingURL=config.js.map