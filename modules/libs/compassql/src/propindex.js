import { keys } from './util';
import { toKey } from './property';
/**
 * Dictionary that takes property as a key.
 */
export class PropIndex {
    constructor(i = null) {
        this.index = i ? Object.assign({}, i) : {};
    }
    has(p) {
        return toKey(p) in this.index;
    }
    get(p) {
        return this.index[toKey(p)];
    }
    set(p, value) {
        this.index[toKey(p)] = value;
        return this;
    }
    setByKey(key, value) {
        this.index[key] = value;
    }
    map(f) {
        const i = new PropIndex();
        for (const k in this.index) {
            i.index[k] = f(this.index[k]);
        }
        return i;
    }
    size() {
        return keys(this.index).length;
    }
    duplicate() {
        return new PropIndex(this.index);
    }
}
//# sourceMappingURL=propindex.js.map