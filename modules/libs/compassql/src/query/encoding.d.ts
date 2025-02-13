import { AggregateOp } from 'vega';
import { Axis } from 'vega-lite/build/src/axis';
import { BinParams } from 'vega-lite/build/src/bin';
import { ExtendedChannel } from 'vega-lite/build/src/channel';
import * as vlChannelDef from 'vega-lite/build/src/channeldef';
import { ValueDef } from 'vega-lite/build/src/channeldef';
import { Encoding } from 'vega-lite/build/src/encoding';
import { Legend } from 'vega-lite/build/src/legend';
import { Scale } from 'vega-lite/build/src/scale';
import { EncodingSortField, SortOrder } from 'vega-lite/build/src/sort';
import { StackOffset } from 'vega-lite/build/src/stack';
import { TimeUnit } from 'vega-lite/build/src/timeunit';
import { FlatProp } from '../property';
import { Schema } from '../schema';
import { SHORT_WILDCARD, Wildcard, WildcardProperty } from '../wildcard';
import { ExpandedType } from './expandedtype';
export declare type EncodingQuery = FieldQuery | ValueQuery | AutoCountQuery;
export interface EncodingQueryBase {
    channel: WildcardProperty<ExtendedChannel>;
    description?: string;
}
export interface ValueQuery extends EncodingQueryBase {
    value: WildcardProperty<boolean | number | string>;
}
export declare function isValueQuery(encQ: EncodingQuery): encQ is ValueQuery;
export declare function isFieldQuery(encQ: EncodingQuery): encQ is FieldQuery;
export declare function isAutoCountQuery(encQ: EncodingQuery): encQ is AutoCountQuery;
export declare function isDisabledAutoCountQuery(encQ: EncodingQuery): boolean;
export declare function isEnabledAutoCountQuery(encQ: EncodingQuery): boolean;
/**
 * A special encoding query that gets added internally if the `config.autoCount` flag is on. See SpecQueryModel.build for its generation.
 *
 * __Note:__ this type of query should not be specified by users.
 */
export interface AutoCountQuery extends EncodingQueryBase {
    /**
     * A count function that gets added internally if the config.autoCount flag in on.
     * This allows us to add one extra encoding mapping if needed when the query produces
     * plot that only have discrete fields.
     * In such cases, adding count make the output plots way more meaningful.
     */
    autoCount: WildcardProperty<boolean>;
    type: 'quantitative';
}
export interface FieldQueryBase {
    aggregate?: WildcardProperty<AggregateOp>;
    timeUnit?: WildcardProperty<TimeUnit>;
    /**
     * Special flag for enforcing that the field should have a fuction (one of timeUnit, bin, or aggregate).
     *
     * For example, if you enumerate both bin and aggregate then you need `undefined` for both.
     *
     * ```
     * {aggregate: {enum: [undefined, 'mean', 'sum']}, bin: {enum: [false, true]}}
     * ```
     *
     * This would enumerate a fieldDef with "mean", "sum", bin:true, and no function at all.
     * If you want only "mean", "sum", bin:true, then use `hasFn: true`
     *
     * ```
     * {aggregate: {enum: [undefined, 'mean', 'sum']}, bin: {enum: [false, true]}, hasFn: true}
     * ```
     */
    hasFn?: boolean;
    bin?: boolean | BinQuery | SHORT_WILDCARD;
    scale?: boolean | ScaleQuery | SHORT_WILDCARD;
    sort?: SortOrder | EncodingSortField<string>;
    stack?: StackOffset | SHORT_WILDCARD;
    field?: WildcardProperty<string>;
    type?: WildcardProperty<ExpandedType>;
    axis?: boolean | AxisQuery | SHORT_WILDCARD;
    legend?: boolean | LegendQuery | SHORT_WILDCARD;
    format?: string;
}
export declare type FieldQuery = EncodingQueryBase & FieldQueryBase;
export declare type FlatQuery<T> = {
    [P in keyof T]: WildcardProperty<T[P]>;
};
export declare type FlatQueryWithEnableFlag<T> = (Wildcard<boolean> | {}) & FlatQuery<T>;
export declare type BinQuery = FlatQueryWithEnableFlag<BinParams>;
export declare type ScaleQuery = FlatQueryWithEnableFlag<Scale>;
export declare type AxisQuery = FlatQueryWithEnableFlag<Axis>;
export declare type LegendQuery = FlatQueryWithEnableFlag<Legend<any>>;
export interface ConversionParams {
    schema?: Schema;
    props?: FlatProp[];
    wildcardMode?: 'skip' | 'null';
}
export declare function toEncoding(encQs: EncodingQuery[], params: ConversionParams): Encoding<string>;
export declare function toValueDef(valueQ: ValueQuery): ValueDef;
export declare function toFieldDef(encQ: FieldQuery | AutoCountQuery, params?: ConversionParams): vlChannelDef.TypedFieldDef<string>;
/**
 * Is a field query continuous field?
 * This method is applicable only for fieldQuery without wildcard
 */
export declare function isContinuous(encQ: EncodingQuery): boolean;
export declare function isMeasure(encQ: EncodingQuery): boolean;
/**
 * Is a field query discrete field?
 * This method is applicable only for fieldQuery without wildcard
 */
export declare function isDimension(encQ: EncodingQuery): boolean;
/**
 *  Returns the true scale type of an encoding.
 *  @returns {ScaleType} If the scale type was not specified, it is inferred from the encoding's TYPE.
 *  @returns {undefined} If the scale type was not specified and Type (or TimeUnit if applicable) is a Wildcard, there is no clear scale type
 */
export declare function scaleType(fieldQ: FieldQuery): import("vega-lite/build/src/scale").ScaleType;
