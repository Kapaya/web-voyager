import { ExtendedChannel } from 'vega-lite/build/src/channel';
import { Data } from 'vega-lite/build/src/data';
import { Mark } from 'vega-lite/build/src/mark';
import { FacetedUnitSpec, TopLevel } from 'vega-lite/build/src/spec';
import { StackOffset, StackProperties } from 'vega-lite/build/src/stack';
import { QueryConfig } from './config';
import { Property } from './property';
import { EncodingQuery } from './query/encoding';
import { ExtendedGroupBy } from './query/groupby';
import { SpecQuery } from './query/spec';
import { RankingScore } from './ranking/ranking';
import { ResultTree } from './result';
import { Schema } from './schema';
import { Dict } from './util';
import { Wildcard } from './wildcard';
import { WildcardIndex } from './wildcardindex';
/**
 * Internal class for specQuery that provides helper for the enumeration process.
 */
export declare class SpecQueryModel {
    private _spec;
    /** channel => EncodingQuery */
    private _channelFieldCount;
    private _wildcardIndex;
    private _assignedWildcardIndex;
    private _schema;
    private _opt;
    private _rankingScore;
    /**
     * Build a WildcardIndex by detecting wildcards
     * in the input specQuery and replacing short wildcards ("?")
     * with full ones (objects with `name` and `enum` values).
     *
     * @return a SpecQueryModel that wraps the specQuery and the WildcardIndex.
     */
    static build(specQ: SpecQuery, schema: Schema, opt: QueryConfig): SpecQueryModel;
    constructor(spec: SpecQuery, wildcardIndex: WildcardIndex, schema: Schema, opt: QueryConfig, wildcardAssignment: Dict<any>);
    get wildcardIndex(): WildcardIndex;
    get schema(): Schema;
    get specQuery(): SpecQuery;
    duplicate(): SpecQueryModel;
    setMark(mark: Mark): void;
    resetMark(): void;
    getMark(): import("./wildcard").WildcardProperty<"square" | "area" | "circle" | "image" | "line" | "rect" | "text" | "point" | "arc" | "rule" | "trail" | "geoshape" | "bar" | "tick">;
    getEncodingProperty(index: number, prop: Property): any;
    setEncodingProperty(index: number, prop: Property, value: any, wildcard: Wildcard<any>): void;
    resetEncodingProperty(index: number, prop: Property, wildcard: Wildcard<any>): void;
    channelUsed(channel: ExtendedChannel): boolean;
    channelEncodingField(channel: ExtendedChannel): boolean;
    getEncodings(): EncodingQuery[];
    getEncodingQueryByChannel(channel: ExtendedChannel): EncodingQuery;
    getEncodingQueryByIndex(i: number): EncodingQuery;
    isAggregate(): boolean;
    /**
     * @return The Vega-Lite `StackProperties` object that describes the stack
     * configuration of `this`. Returns `null` if this is not stackable.
     */
    getVlStack(): StackProperties;
    /**
     * @return The `StackOffset` specified in `this`, `undefined` if none
     * is specified.
     */
    getStackOffset(): StackOffset;
    /**
     * @return The `ExtendedChannel` in which `stack` is specified in `this`, or
     * `null` if none is specified.
     */
    getStackChannel(): ExtendedChannel;
    toShorthand(groupBy?: string | (string | ExtendedGroupBy)[]): string;
    /**
     * Convert a query to a Vega-Lite spec if it is completed.
     * @return a Vega-Lite spec if completed, null otherwise.
     */
    toSpec(data?: Data): TopLevel<FacetedUnitSpec>;
    getRankingScore(rankingName: string): RankingScore;
    setRankingScore(rankingName: string, score: RankingScore): void;
}
export declare type SpecQueryModelGroup = ResultTree<SpecQueryModel>;
