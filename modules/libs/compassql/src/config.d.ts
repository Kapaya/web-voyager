import * as CHANNEL from 'vega-lite/build/src/channel';
import { Channel, ExtendedChannel } from 'vega-lite/build/src/channel';
import { Config } from 'vega-lite/build/src/config';
import { EnumIndex } from './wildcard';
export interface QueryConfig {
    verbose?: boolean;
    defaultSpecConfig?: Config;
    propertyPrecedence?: string[];
    enum?: Partial<EnumIndex>;
    /** Default ratio for number fields to be considered ordinal */
    numberNominalProportion?: number;
    /** Default cutoff for not applying the numberOrdinalProportion inference */
    numberNominalLimit?: number;
    /**
     * Allow automatically adding a special count (autoCount) field for plots
     * that contain only discrete fields. In such cases, adding count make the
     * output plots way more meaningful.
     */
    autoAddCount?: boolean;
    constraintManuallySpecifiedValue?: boolean;
    hasAppropriateGraphicTypeForMark?: boolean;
    omitAggregate?: boolean;
    omitAggregatePlotWithDimensionOnlyOnFacet?: boolean;
    omitAggregatePlotWithoutDimension?: boolean;
    omitBarLineAreaWithOcclusion?: boolean;
    omitBarTickWithSize?: boolean;
    omitMultipleNonPositionalChannels?: boolean;
    omitRaw?: boolean;
    omitRawContinuousFieldForAggregatePlot?: boolean;
    omitRawWithXYBothOrdinalScaleOrBin?: boolean;
    omitRepeatedField?: boolean;
    omitNonPositionalOrFacetOverPositionalChannels?: boolean;
    omitTableWithOcclusionIfAutoAddCount?: boolean;
    omitVerticalDotPlot?: boolean;
    omitInvalidStackSpec?: boolean;
    omitNonSumStack?: boolean;
    preferredBinAxis?: Channel;
    preferredTemporalAxis?: Channel;
    preferredOrdinalAxis?: Channel;
    preferredNominalAxis?: Channel;
    preferredFacet?: ExtendedChannel;
    minCardinalityForBin?: number;
    maxCardinalityForCategoricalColor?: number;
    maxCardinalityForFacet?: number;
    maxCardinalityForShape?: number;
    timeUnitShouldHaveVariation?: boolean;
    typeMatchesSchemaType?: boolean;
    stylize?: boolean;
    smallRangeStepForHighCardinalityOrFacet?: {
        maxCardinality: number;
        rangeStep: number;
    };
    nominalColorScaleForHighCardinality?: {
        maxCardinality: number;
        palette: string;
    };
    xAxisOnTopForHighYCardinalityWithoutColumn?: {
        maxCardinality: number;
    };
    maxGoodCardinalityForColor?: number;
    maxGoodCardinalityForFacet?: number;
    minPercentUniqueForKey?: number;
    minCardinalityForKey?: number;
}
export declare const DEFAULT_QUERY_CONFIG: QueryConfig;
export declare function extendConfig(opt: QueryConfig): {
    enum: EnumIndex;
    verbose?: boolean;
    defaultSpecConfig?: Config<import("vega-typings/types").SignalRef | import("vega-lite/build/src/expr").ExprRef>;
    propertyPrecedence?: string[];
    numberNominalProportion?: number;
    numberNominalLimit?: number;
    autoAddCount?: boolean;
    constraintManuallySpecifiedValue?: boolean;
    hasAppropriateGraphicTypeForMark?: boolean;
    omitAggregate?: boolean;
    omitAggregatePlotWithDimensionOnlyOnFacet?: boolean;
    omitAggregatePlotWithoutDimension?: boolean;
    omitBarLineAreaWithOcclusion?: boolean;
    omitBarTickWithSize?: boolean;
    omitMultipleNonPositionalChannels?: boolean;
    omitRaw?: boolean;
    omitRawContinuousFieldForAggregatePlot?: boolean;
    omitRawWithXYBothOrdinalScaleOrBin?: boolean;
    omitRepeatedField?: boolean;
    omitNonPositionalOrFacetOverPositionalChannels?: boolean;
    omitTableWithOcclusionIfAutoAddCount?: boolean;
    omitVerticalDotPlot?: boolean;
    omitInvalidStackSpec?: boolean;
    omitNonSumStack?: boolean;
    preferredBinAxis?: keyof import("vega-lite/build/src/encoding").Encoding<any>;
    preferredTemporalAxis?: keyof import("vega-lite/build/src/encoding").Encoding<any>;
    preferredOrdinalAxis?: keyof import("vega-lite/build/src/encoding").Encoding<any>;
    preferredNominalAxis?: keyof import("vega-lite/build/src/encoding").Encoding<any>;
    preferredFacet?: CHANNEL.ExtendedChannel;
    minCardinalityForBin?: number;
    maxCardinalityForCategoricalColor?: number;
    maxCardinalityForFacet?: number;
    maxCardinalityForShape?: number;
    timeUnitShouldHaveVariation?: boolean;
    typeMatchesSchemaType?: boolean;
    stylize?: boolean;
    smallRangeStepForHighCardinalityOrFacet?: {
        maxCardinality: number;
        rangeStep: number;
    };
    nominalColorScaleForHighCardinality?: {
        maxCardinality: number;
        palette: string;
    };
    xAxisOnTopForHighYCardinalityWithoutColumn?: {
        maxCardinality: number;
    };
    maxGoodCardinalityForColor?: number;
    maxGoodCardinalityForFacet?: number;
    minPercentUniqueForKey?: number;
    minCardinalityForKey?: number;
};
