import { Axis } from 'vega-lite/build/src/axis';
import { BinParams } from 'vega-lite/build/src/bin';
import { Legend } from 'vega-lite/build/src/legend';
import { Scale } from 'vega-lite/build/src/scale';
import { EncodingSortField } from 'vega-lite/build/src/sort';
import { AutoCountQuery, FieldQuery, ValueQuery } from './query/encoding';
import { TransformQuery } from './query/transform';
import { Diff } from './util';
/**
 * There are two types of `Property`'s.
 * One is just flat property names.
 * (Try to hover `FlatProp` to see all of them.)
 * Another is an object that describes a parent property (e.g., `scale`) and the child property (e.g., `type`)
 */
export declare type Property = FlatProp | EncodingNestedProp;
export declare type FlatProp = MarkProp | TransformProp | ViewProp | EncodingTopLevelProp;
export declare type MarkProp = 'mark' | 'stack';
export declare type TransformProp = keyof TransformQuery;
export declare type ViewProp = 'width' | 'height' | 'background' | 'padding' | 'title';
export declare type EncodingTopLevelProp = Diff<keyof (FieldQuery & ValueQuery & AutoCountQuery), 'description'>;
export declare type EncodingNestedProp = BinProp | SortProp | ScaleProp | AxisProp | LegendProp;
export declare type EncodingNestedChildProp = keyof BinParams | keyof EncodingSortField<string> | keyof Scale | keyof Axis | keyof Legend<any>;
/**
 * An object that describes a parent property (e.g., `scale`) and the child property (e.g., `type`)
 */
export declare type BaseEncodingNestedProp<P, T> = {
    parent: P;
    child: keyof T;
};
export declare type BinProp = BaseEncodingNestedProp<'bin', BinParams>;
export declare type SortProp = BaseEncodingNestedProp<'sort', EncodingSortField<string>>;
export declare type ScaleProp = BaseEncodingNestedProp<'scale', Scale>;
export declare type AxisProp = BaseEncodingNestedProp<'axis', Axis>;
export declare type LegendProp = BaseEncodingNestedProp<'legend', Legend<any>>;
export declare function isEncodingNestedProp(p: Property): p is EncodingNestedProp;
export declare const ENCODING_TOPLEVEL_PROPS: EncodingTopLevelProp[];
export declare function isEncodingTopLevelProperty(p: Property): p is EncodingTopLevelProp;
export declare type EncodingNestedPropParent = 'bin' | 'scale' | 'sort' | 'axis' | 'legend';
export declare function isEncodingNestedParent(prop: string): prop is EncodingNestedPropParent;
export declare const BIN_CHILD_PROPS: (keyof BinParams)[];
export declare const SORT_CHILD_PROPS: (keyof EncodingSortField<string>)[];
export declare const SORT_PROPS: SortProp[];
export declare const SCALE_PROPS: ScaleProp[];
export declare const ENCODING_NESTED_PROPS: EncodingNestedProp[];
export declare const VIEW_PROPS: Property[];
export declare function toKey(p: Property): string;
export declare function fromKey(k: string): Property;
export declare function getEncodingNestedProp(parent: EncodingTopLevelProp, child: EncodingNestedChildProp): any;
export declare function isEncodingProperty(p: Property): p is EncodingTopLevelProp | EncodingNestedProp;
export declare const ALL_ENCODING_PROPS: Property[];
export declare const DEFAULT_PROP_PRECEDENCE: Property[];
export declare namespace Property {
    const MARK: 'mark';
    const TRANSFORM: 'transform';
    const STACK: 'stack';
    const FORMAT: 'format';
    const CHANNEL: 'channel';
    const AGGREGATE: 'aggregate';
    const AUTOCOUNT: 'autoCount';
    const BIN: 'bin';
    const HAS_FN: 'hasFn';
    const TIMEUNIT: 'timeUnit';
    const FIELD: 'field';
    const TYPE: 'type';
    const SORT: 'sort';
    const SCALE: 'scale';
    const AXIS: 'axis';
    const LEGEND: 'legend';
    const WIDTH: 'width';
    const HEIGHT: 'height';
    const BACKGROUND: 'background';
    const PADDING: 'padding';
    const TITLE: 'title';
}
