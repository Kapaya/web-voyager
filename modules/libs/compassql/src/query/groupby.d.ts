import { PropIndex } from '../propindex';
import { Dict } from '../util';
export interface ExtendedGroupBy {
    property: string;
    replace?: Dict<string>;
}
export declare const REPLACE_BLANK_FIELDS: Dict<string>;
export declare const REPLACE_XY_CHANNELS: Dict<string>;
export declare const REPLACE_FACET_CHANNELS: Dict<string>;
export declare const REPLACE_MARK_STYLE_CHANNELS: Dict<string>;
export declare function isExtendedGroupBy(g: string | ExtendedGroupBy): g is ExtendedGroupBy;
export declare type GroupBy = string | Array<string | ExtendedGroupBy>;
export interface Nest {
    groupBy: GroupBy;
    orderGroupBy?: string | string[];
}
export declare function parseGroupBy(groupBy: Array<string | ExtendedGroupBy>, include?: PropIndex<boolean>, replaceIndex?: PropIndex<Dict<string>>): {
    include: PropIndex<boolean>;
    replaceIndex: PropIndex<Dict<string>>;
    replacer: PropIndex<import("./shorthand").Replacer>;
};
export declare function toString(groupBy: GroupBy): string;
export declare const GROUP_BY_FIELD_TRANSFORM: ("type" | "aggregate" | "bin" | "stack" | "field" | "timeUnit")[];
export declare const GROUP_BY_ENCODING: (string | ExtendedGroupBy)[];
