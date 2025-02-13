import { isEncodingProperty } from './property';
import { PropIndex } from './propindex';
export class WildcardIndex {
    constructor() {
        this._mark = undefined;
        this._encodings = {};
        this._encodingIndicesByProperty = new PropIndex();
    }
    setEncodingProperty(index, prop, wildcard) {
        const encodingsIndex = this._encodings;
        // Init encoding index and set prop
        const encIndex = (encodingsIndex[index] = encodingsIndex[index] || new PropIndex());
        encIndex.set(prop, wildcard);
        // Initialize indicesByProperty[prop] and add index
        const indicesByProp = this._encodingIndicesByProperty;
        indicesByProp.set(prop, indicesByProp.get(prop) || []);
        indicesByProp.get(prop).push(index);
        return this;
    }
    hasEncodingProperty(index, prop) {
        return !!this._encodings[index] && this._encodings[index].has(prop);
    }
    hasProperty(prop) {
        if (isEncodingProperty(prop)) {
            return this.encodingIndicesByProperty.has(prop);
        }
        else if (prop === 'mark') {
            return !!this.mark;
        }
        /* istanbul ignore next */
        throw new Error(`Unimplemented for property ${prop}`);
    }
    isEmpty() {
        return !this.mark && this.encodingIndicesByProperty.size() === 0;
    }
    setMark(mark) {
        this._mark = mark;
        return this;
    }
    get mark() {
        return this._mark;
    }
    get encodings() {
        return this._encodings;
    }
    get encodingIndicesByProperty() {
        return this._encodingIndicesByProperty;
    }
}
//# sourceMappingURL=wildcardindex.js.map