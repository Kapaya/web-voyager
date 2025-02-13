import { isArray } from 'datalib/src/util';
export { cmp, keys, duplicate, extend, isObject, isBoolean, toMap } from 'datalib/src/util';
export { isArray };
export function contains(array, item) {
    return array.indexOf(item) !== -1;
}
export function every(arr, f) {
    for (let i = 0; i < arr.length; i++) {
        if (!f(arr[i], i)) {
            return false;
        }
    }
    return true;
}
export function forEach(obj, f, thisArg) {
    if (obj.forEach) {
        obj.forEach.call(thisArg, f);
    }
    else {
        for (const k in obj) {
            f.call(thisArg, obj[k], k, obj);
        }
    }
}
export function some(arr, f) {
    let i = 0;
    for (let k = 0; k < arr.length; k++) {
        if (f(arr[k], k, i++)) {
            return true;
        }
    }
    return false;
}
export function nestedMap(array, f) {
    return array.map((a) => {
        if (isArray(a)) {
            return nestedMap(a, f);
        }
        return f(a);
    });
}
/** Returns the array without the elements in item */
export function without(array, excludedItems) {
    return array.filter(function (item) {
        return !contains(excludedItems, item);
    });
}
export function flagKeys(f) {
    return Object.keys(f);
}
//# sourceMappingURL=util.js.map