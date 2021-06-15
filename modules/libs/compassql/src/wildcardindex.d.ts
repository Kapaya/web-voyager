import { Mark } from 'vega-lite/build/src/mark';
import { Wildcard } from './wildcard';
import { Property } from './property';
import { PropIndex } from './propindex';
export interface EncodingsWildcardIndex {
    [index: number]: PropIndex<Wildcard<any>>;
}
export declare class WildcardIndex {
    private _mark;
    /**
     * Dictionary mapping encoding index to an encoding wildcard index.
     */
    private _encodings;
    private _encodingIndicesByProperty;
    constructor();
    setEncodingProperty(index: number, prop: Property, wildcard: Wildcard<any>): this;
    hasEncodingProperty(index: number, prop: Property): boolean;
    hasProperty(prop: Property): boolean;
    isEmpty(): boolean;
    setMark(mark: Wildcard<Mark>): this;
    get mark(): Wildcard<"square" | "area" | "circle" | "image" | "line" | "rect" | "text" | "point" | "arc" | "rule" | "trail" | "geoshape" | "bar" | "tick">;
    get encodings(): EncodingsWildcardIndex;
    get encodingIndicesByProperty(): PropIndex<number[]>;
}
