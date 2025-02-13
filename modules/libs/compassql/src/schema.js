import dlBin_ from 'datalib/src/bins/bins';
import { inferAll } from 'datalib/src/import/type';
import { summary } from 'datalib/src/stats';
import { autoMaxBins } from 'vega-lite/build/src/bin';
import { isUTCTimeUnit, containsTimeUnit, TIMEUNIT_PARTS, } from 'vega-lite/build/src/timeunit';
import * as TYPE from 'vega-lite/build/src/type';
import * as vegaTime from 'vega-time';
import { DEFAULT_QUERY_CONFIG } from './config';
import { isAutoCountQuery } from './query/encoding';
import { ExpandedType } from './query/expandedtype';
import { cmp, duplicate, extend, keys } from './util';
const dlBin = dlBin_;
/**
 * Build a Schema object.
 *
 * @param data - a set of raw data in the same format that Vega-Lite / Vega takes
 * Basically, it's an array in the form of:
 *
 * [
 *   {a: 1, b:2},
 *   {a: 2, b:3},
 *   ...
 * ]
 *
 * @return a Schema object
 */
export function build(data, opt = {}, tableSchema = { fields: [] }) {
    opt = extend({}, DEFAULT_QUERY_CONFIG, opt);
    // create profiles for each variable
    const summaries = summary(data);
    const types = inferAll(data); // inferAll does stronger type inference than summary
    const tableSchemaFieldIndex = tableSchema.fields.reduce((m, field) => {
        m[field.name] = field;
        return m;
    }, {});
    const fieldSchemas = summaries.map(function (fieldProfile, index) {
        const name = fieldProfile.field;
        // In Table schema, 'date' doesn't include time so use 'datetime'
        const type = types[name] === 'date' ? PrimitiveType.DATETIME : types[name];
        const distinct = fieldProfile.distinct;
        let vlType;
        if (type === PrimitiveType.NUMBER) {
            vlType = TYPE.QUANTITATIVE;
        }
        else if (type === PrimitiveType.INTEGER) {
            // use ordinal or nominal when cardinality of integer type is relatively low and the distinct values are less than an amount specified in options
            if (distinct < opt.numberNominalLimit && distinct / fieldProfile.count < opt.numberNominalProportion) {
                vlType = TYPE.NOMINAL;
            }
            else {
                vlType = TYPE.QUANTITATIVE;
            }
        }
        else if (type === PrimitiveType.DATETIME) {
            vlType = TYPE.TEMPORAL;
            // need to get correct min/max of date data because datalib's summary method does not
            // calculate this correctly for date types.
            fieldProfile.min = new Date(data[0][name]);
            fieldProfile.max = new Date(data[0][name]);
            for (const dataEntry of data) {
                const time = new Date(dataEntry[name]).getTime();
                if (time < fieldProfile.min.getTime()) {
                    fieldProfile.min = new Date(time);
                }
                if (time > fieldProfile.max.getTime()) {
                    fieldProfile.max = new Date(time);
                }
            }
        }
        else {
            vlType = TYPE.NOMINAL;
        }
        if (vlType === TYPE.NOMINAL &&
            distinct / fieldProfile.count > opt.minPercentUniqueForKey &&
            fieldProfile.count > opt.minCardinalityForKey) {
            vlType = ExpandedType.KEY;
        }
        let fieldSchema = {
            name: name,
            // Need to keep original index for re-exporting TableSchema
            originalIndex: index,
            vlType: vlType,
            type: type,
            stats: fieldProfile,
            timeStats: {},
            binStats: {},
        };
        // extend field schema with table schema field - if present
        const orgFieldSchema = tableSchemaFieldIndex[fieldSchema.name];
        fieldSchema = extend(fieldSchema, orgFieldSchema);
        return fieldSchema;
    });
    // calculate preset bins for quantitative and temporal data
    for (const fieldSchema of fieldSchemas) {
        if (fieldSchema.vlType === TYPE.QUANTITATIVE) {
            for (const maxbins of opt.enum.binProps.maxbins) {
                fieldSchema.binStats[maxbins] = binSummary(maxbins, fieldSchema.stats);
            }
        }
        else if (fieldSchema.vlType === TYPE.TEMPORAL) {
            for (const unit of opt.enum.timeUnit) {
                if (unit !== undefined) {
                    if (typeof unit === 'object') {
                        if ('unit' in unit) {
                            // is TimeUnitParams
                            fieldSchema.timeStats[unit.unit] = timeSummary(unit.unit, fieldSchema.stats);
                        }
                        else {
                            throw new Error('Unrecognized TimeUnit type when calculating fieldSchema.stats');
                        }
                    }
                    else {
                        fieldSchema.timeStats[unit] = timeSummary(unit, fieldSchema.stats);
                    }
                }
            }
        }
    }
    const derivedTableSchema = Object.assign(Object.assign({}, tableSchema), { fields: fieldSchemas });
    return new Schema(derivedTableSchema);
}
// order the field schema when we construct a new Schema
// this orders the fields in the UI
const order = {
    nominal: 0,
    key: 1,
    ordinal: 2,
    temporal: 3,
    quantitative: 4,
};
export class Schema {
    constructor(tableSchema) {
        this._tableSchema = tableSchema;
        tableSchema.fields.sort(function (a, b) {
            // first order by vlType: nominal < temporal < quantitative < ordinal
            if (order[a.vlType] < order[b.vlType]) {
                return -1;
            }
            else if (order[a.vlType] > order[b.vlType]) {
                return 1;
            }
            else {
                // then order by field (alphabetically)
                return a.name.localeCompare(b.name);
            }
        });
        // Add index for sorting
        tableSchema.fields.forEach((fieldSchema, index) => (fieldSchema.index = index));
        this._fieldSchemaIndex = tableSchema.fields.reduce((m, fieldSchema) => {
            m[fieldSchema.name] = fieldSchema;
            return m;
        }, {});
    }
    /** @return a list of the field names (for enumerating). */
    fieldNames() {
        return this._tableSchema.fields.map((fieldSchema) => fieldSchema.name);
    }
    /** @return a list of FieldSchemas */
    get fieldSchemas() {
        return this._tableSchema.fields;
    }
    fieldSchema(fieldName) {
        return this._fieldSchemaIndex[fieldName];
    }
    tableSchema() {
        // the fieldschemas are re-arranged
        // but this is not allowed in table schema.
        // so we will re-order based on original index.
        const tableSchema = duplicate(this._tableSchema);
        tableSchema.fields.sort((a, b) => a.originalIndex - b.originalIndex);
        return tableSchema;
    }
    /**
     * @return primitive type of the field if exist, otherwise return null
     */
    primitiveType(fieldName) {
        return this._fieldSchemaIndex[fieldName] ? this._fieldSchemaIndex[fieldName].type : null;
    }
    /**
     * @return vlType of measturement of the field if exist, otherwise return null
     */
    vlType(fieldName) {
        return this._fieldSchemaIndex[fieldName] ? this._fieldSchemaIndex[fieldName].vlType : null;
    }
    /** @return cardinality of the field associated with encQ, null if it doesn't exist.
     *  @param augmentTimeUnitDomain - TimeUnit field domains will not be augmented if explicitly set to false.
     */
    cardinality(fieldQ, augmentTimeUnitDomain = true, excludeInvalid = false) {
        const fieldSchema = this._fieldSchemaIndex[fieldQ.field];
        if (fieldQ.aggregate || (isAutoCountQuery(fieldQ) && fieldQ.autoCount)) {
            return 1;
        }
        else if (fieldQ.bin) {
            // encQ.bin will either be a boolean or a BinQuery
            let bin;
            if (typeof fieldQ.bin === 'boolean') {
                // autoMaxBins defaults to 10 if channel is Wildcard
                bin = {
                    maxbins: autoMaxBins(fieldQ.channel),
                };
            }
            else if (fieldQ.bin === '?') {
                bin = {
                    enum: [true, false],
                };
            }
            else {
                bin = fieldQ.bin;
            }
            const maxbins = bin.maxbins;
            if (!fieldSchema.binStats[maxbins]) {
                // need to calculate
                fieldSchema.binStats[maxbins] = binSummary(maxbins, fieldSchema.stats);
            }
            // don't need to worry about excludeInvalid here because invalid values don't affect linearly binned field's cardinality
            return fieldSchema.binStats[maxbins].distinct;
        }
        else if (fieldQ.timeUnit) {
            if (augmentTimeUnitDomain) {
                switch (fieldQ.timeUnit) {
                    // TODO: this should not always be the case once Vega-Lite supports turning off domain augmenting (VL issue #1385)
                    case vegaTime.SECONDS:
                        return 60;
                    case vegaTime.MINUTES:
                        return 60;
                    case vegaTime.HOURS:
                        return 24;
                    case vegaTime.DAY:
                        return 7;
                    case vegaTime.DATE:
                        return 31;
                    case vegaTime.MONTH:
                        return 12;
                    case vegaTime.QUARTER:
                        return 4;
                    case vegaTime.MILLISECONDS:
                        return 1000;
                }
            }
            const unit = fieldQ.timeUnit;
            let timeStats = fieldSchema.timeStats;
            // if the cardinality for the timeUnit is not cached, calculate it
            if (!timeStats || !timeStats[unit]) {
                timeStats = Object.assign(Object.assign({}, timeStats), { [unit]: timeSummary(fieldQ.timeUnit, fieldSchema.stats) });
            }
            if (excludeInvalid) {
                return timeStats[unit].distinct - invalidCount(timeStats[unit].unique, ['Invalid Date', null]);
            }
            else {
                return timeStats[unit].distinct;
            }
        }
        else {
            if (fieldSchema) {
                if (excludeInvalid) {
                    return fieldSchema.stats.distinct - invalidCount(fieldSchema.stats.unique, [NaN, null]);
                }
                else {
                    return fieldSchema.stats.distinct;
                }
            }
            else {
                return null;
            }
        }
    }
    /**
     * Given an EncodingQuery with a timeUnit, returns true if the date field
     * has multiple distinct values for all parts of the timeUnit. Returns undefined
     * if the timeUnit is undefined.
     * i.e.
     * ('yearmonth', [Jan 1 2000, Feb 2 2000] returns false)
     * ('yearmonth', [Jan 1 2000, Feb 2 2001] returns true)
     */
    timeUnitHasVariation(fieldQ) {
        if (!fieldQ.timeUnit) {
            return;
        }
        // if there is no variation in `date`, there should not be variation in `day`
        if (fieldQ.timeUnit === vegaTime.DAY) {
            const dateEncQ = extend({}, fieldQ, { timeUnit: vegaTime.DATE });
            if (this.cardinality(dateEncQ, false, true) <= 1) {
                return false;
            }
        }
        const fullTimeUnit = fieldQ.timeUnit;
        for (const timeUnitPart of TIMEUNIT_PARTS) {
            if (containsTimeUnit(fullTimeUnit, timeUnitPart)) {
                // Create a clone of encQ, but with singleTimeUnit
                const singleUnitEncQ = extend({}, fieldQ, { timeUnit: timeUnitPart });
                if (this.cardinality(singleUnitEncQ, false, true) <= 1) {
                    return false;
                }
            }
        }
        return true;
    }
    domain(fieldQueryParts) {
        // TODO: differentiate for field with bin / timeUnit
        const fieldSchema = this._fieldSchemaIndex[fieldQueryParts.field];
        let domain = keys(fieldSchema.stats.unique);
        if (fieldSchema.vlType === TYPE.QUANTITATIVE) {
            // return [min, max], coerced into number types
            return [+fieldSchema.stats.min, +fieldSchema.stats.max];
        }
        else if (fieldSchema.type === PrimitiveType.DATETIME) {
            // return [min, max] dates
            return [fieldSchema.stats.min, fieldSchema.stats.max];
        }
        else if (fieldSchema.type === PrimitiveType.INTEGER || fieldSchema.type === PrimitiveType.NUMBER) {
            // coerce non-quantitative numerical data into number type
            domain = domain.map((x) => +x);
            return domain.sort(cmp);
        }
        else if (fieldSchema.vlType === TYPE.ORDINAL && fieldSchema.ordinalDomain) {
            return fieldSchema.ordinalDomain;
        }
        return domain
            .map((x) => {
            // Convert 'null' to null as it is encoded similarly in datalib.
            // This is wrong when it is a string 'null' but that rarely happens.
            return x === 'null' ? null : x;
        })
            .sort(cmp);
    }
    /**
     * @return a Summary corresponding to the field of the given EncodingQuery
     */
    stats(fieldQ) {
        // TODO: differentiate for field with bin / timeUnit vs without
        const fieldSchema = this._fieldSchemaIndex[fieldQ.field];
        return fieldSchema ? fieldSchema.stats : null;
    }
}
/**
 * @return a summary of the binning scheme determined from the given max number of bins
 */
function binSummary(maxbins, summary) {
    const bin = dlBin({
        min: summary.min,
        max: summary.max,
        maxbins: maxbins,
    });
    // start with summary, pre-binning
    const result = extend({}, summary);
    result.unique = binUnique(bin, summary.unique);
    result.distinct = (bin.stop - bin.start) / bin.step;
    result.min = bin.start;
    result.max = bin.stop;
    return result;
}
const SET_DATE_METHOD = {
    year: 'setFullYear',
    month: 'setMonth',
    date: 'setDate',
    hours: 'setHours',
    minutes: 'setMinutes',
    seconds: 'setSeconds',
    milliseconds: 'setMilliseconds',
    // the units below have their own special cases
    dayofyear: null,
    week: null,
    quarter: null,
    day: null,
};
function dateMethods(singleUnit, isUtc) {
    const rawSetDateMethod = SET_DATE_METHOD[singleUnit];
    const setDateMethod = isUtc ? `setUTC${rawSetDateMethod.substr(3)}` : rawSetDateMethod;
    const getDateMethod = `get${isUtc ? 'UTC' : ''}${rawSetDateMethod.substr(3)}`;
    return { setDateMethod, getDateMethod };
}
function convert(unit, date) {
    const isUTC = isUTCTimeUnit(unit);
    const result = isUTC
        ? // start with uniform date
            new Date(Date.UTC(1972, 0, 1, 0, 0, 0, 0)) // 1972 is the first leap year after 1970, the start of unix time
        : new Date(1972, 0, 1, 0, 0, 0, 0);
    for (const timeUnitPart of TIMEUNIT_PARTS) {
        if (containsTimeUnit(unit, timeUnitPart)) {
            switch (timeUnitPart) {
                case vegaTime.DAY:
                    throw new Error("Cannot convert to TimeUnits containing 'day'");
                case vegaTime.DAYOFYEAR:
                    throw new Error("Cannot convert to TimeUnits containing 'dayofyear'");
                case vegaTime.WEEK:
                    throw new Error("Cannot convert to TimeUnits containing 'week'");
                case vegaTime.QUARTER: {
                    const { getDateMethod, setDateMethod } = dateMethods('month', isUTC);
                    // indicate quarter by setting month to be the first of the quarter i.e. may (4) -> april (3)
                    result[setDateMethod](Math.floor(date[getDateMethod]() / 3) * 3);
                    break;
                }
                default: {
                    const { getDateMethod, setDateMethod } = dateMethods(timeUnitPart, isUTC);
                    result[setDateMethod](date[getDateMethod]());
                }
            }
        }
    }
    return result;
}
/** @return a modified version of the passed summary with unique and distinct set according to the timeunit.
 *  Maps 'null' (string) keys to the null value and invalid dates to 'Invalid Date' in the unique dictionary.
 */
function timeSummary(timeunit, summary) {
    const result = extend({}, summary);
    const unique = {};
    keys(summary.unique).forEach(function (dateString) {
        // don't convert null value because the Date constructor will actually convert it to a date
        const date = dateString === 'null' ? null : new Date(dateString);
        // at this point, `date` is either the null value, a valid Date object, or "Invalid Date" which is a Date
        let key;
        if (date === null) {
            key = null;
        }
        else if (isNaN(date.getTime())) {
            key = 'Invalid Date';
        }
        else {
            key = (timeunit === vegaTime.DAY ? date.getDay() : convert(timeunit, date)).toString();
        }
        unique[key] = (unique[key] || 0) + summary.unique[dateString];
    });
    result.unique = unique;
    result.distinct = keys(unique).length;
    return result;
}
/**
 * @return a new unique object based off of the old unique count and a binning scheme
 */
function binUnique(bin, oldUnique) {
    const newUnique = {};
    for (const value in oldUnique) {
        let bucket;
        if (value === null) {
            bucket = null;
        }
        else if (isNaN(Number(value))) {
            bucket = NaN;
        }
        else {
            bucket = bin.value(Number(value));
        }
        newUnique[bucket] = (newUnique[bucket] || 0) + oldUnique[value];
    }
    return newUnique;
}
/** @return the number of items in list that occur as keys of unique */
function invalidCount(unique, list) {
    return list.reduce(function (prev, cur) {
        return unique[cur] ? prev + 1 : prev;
    }, 0);
}
export var PrimitiveType;
(function (PrimitiveType) {
    PrimitiveType[PrimitiveType["STRING"] = 'string'] = "STRING";
    PrimitiveType[PrimitiveType["NUMBER"] = 'number'] = "NUMBER";
    PrimitiveType[PrimitiveType["INTEGER"] = 'integer'] = "INTEGER";
    PrimitiveType[PrimitiveType["BOOLEAN"] = 'boolean'] = "BOOLEAN";
    PrimitiveType[PrimitiveType["DATETIME"] = 'datetime'] = "DATETIME";
})(PrimitiveType || (PrimitiveType = {}));
//# sourceMappingURL=schema.js.map