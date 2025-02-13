import { hasDiscreteDomain } from 'vega-lite/build/src/scale';
import * as TYPE from 'vega-lite/build/src/type';
import { scaleType } from '../../query/encoding';
import { ExpandedType } from '../../query/expandedtype';
/**
 * Finer grained data types that takes binning and timeUnit into account.
 */
export var ExtendedType;
(function (ExtendedType) {
    ExtendedType[ExtendedType["Q"] = TYPE.QUANTITATIVE] = "Q";
    ExtendedType[ExtendedType["BIN_Q"] = `bin_${TYPE.QUANTITATIVE}`] = "BIN_Q";
    ExtendedType[ExtendedType["T"] = TYPE.TEMPORAL] = "T";
    /**
     * Time Unit Temporal Field with time scale.
     */
    ExtendedType[ExtendedType["TIMEUNIT_T"] = 'timeUnit_time'] = "TIMEUNIT_T";
    /**
     * Time Unit Temporal Field with ordinal scale.
     */
    ExtendedType[ExtendedType["TIMEUNIT_O"] = `timeUnit_${TYPE.ORDINAL}`] = "TIMEUNIT_O";
    ExtendedType[ExtendedType["O"] = TYPE.ORDINAL] = "O";
    ExtendedType[ExtendedType["N"] = TYPE.NOMINAL] = "N";
    ExtendedType[ExtendedType["K"] = ExpandedType.KEY] = "K";
    ExtendedType[ExtendedType["NONE"] = '-'] = "NONE";
})(ExtendedType || (ExtendedType = {}));
export const Q = ExtendedType.Q;
export const BIN_Q = ExtendedType.BIN_Q;
export const T = ExtendedType.T;
export const TIMEUNIT_T = ExtendedType.TIMEUNIT_T;
export const TIMEUNIT_O = ExtendedType.TIMEUNIT_O;
export const O = ExtendedType.O;
export const N = ExtendedType.N;
export const K = ExtendedType.K;
export const NONE = ExtendedType.NONE;
export function getExtendedType(fieldQ) {
    if (fieldQ.bin) {
        return ExtendedType.BIN_Q;
    }
    else if (fieldQ.timeUnit) {
        const sType = scaleType(fieldQ);
        return hasDiscreteDomain(sType) ? ExtendedType.TIMEUNIT_O : ExtendedType.TIMEUNIT_T;
    }
    return fieldQ.type;
}
//# sourceMappingURL=type.js.map