import { isString } from 'datalib/src/util';
import * as TYPE from 'vega-lite/build/src/type';
import { getGroupByKey } from './nest';
import { ENCODING_NESTED_PROPS, ENCODING_TOPLEVEL_PROPS, isEncodingNestedParent, isEncodingNestedProp, Property, } from './property';
import { isAutoCountQuery, isDisabledAutoCountQuery, isFieldQuery, toEncoding, } from './query/encoding';
import { parseGroupBy } from './query/groupby';
import { spec as specShorthand } from './query/shorthand';
import { getStackChannel, getStackOffset, getVlStack, isAggregate } from './query/spec';
import { duplicate, extend } from './util';
import { getDefaultEnumValues, getDefaultName, initWildcard, isWildcard, SHORT_WILDCARD } from './wildcard';
import { WildcardIndex } from './wildcardindex';
/**
 * Internal class for specQuery that provides helper for the enumeration process.
 */
export class SpecQueryModel {
    constructor(spec, wildcardIndex, schema, opt, wildcardAssignment) {
        this._rankingScore = {};
        this._spec = spec;
        this._channelFieldCount = spec.encodings.reduce((m, encQ) => {
            if (!isWildcard(encQ.channel) && (!isAutoCountQuery(encQ) || encQ.autoCount !== false)) {
                m[`${encQ.channel}`] = 1;
            }
            return m;
        }, {});
        this._wildcardIndex = wildcardIndex;
        this._assignedWildcardIndex = wildcardAssignment;
        this._opt = opt;
        this._schema = schema;
    }
    /**
     * Build a WildcardIndex by detecting wildcards
     * in the input specQuery and replacing short wildcards ("?")
     * with full ones (objects with `name` and `enum` values).
     *
     * @return a SpecQueryModel that wraps the specQuery and the WildcardIndex.
     */
    static build(specQ, schema, opt) {
        const wildcardIndex = new WildcardIndex();
        // mark
        if (isWildcard(specQ.mark)) {
            const name = getDefaultName(Property.MARK);
            specQ.mark = initWildcard(specQ.mark, name, opt.enum.mark);
            wildcardIndex.setMark(specQ.mark);
        }
        // TODO: transform
        // encodings
        specQ.encodings.forEach((encQ, index) => {
            if (isAutoCountQuery(encQ)) {
                // This is only for testing purpose
                console.warn('A field with autoCount should not be included as autoCount meant to be an internal object.');
                encQ.type = TYPE.QUANTITATIVE; // autoCount is always quantitative
            }
            if (isFieldQuery(encQ) && encQ.type === undefined) {
                // type is optional -- we automatically augment wildcard if not specified
                encQ.type = SHORT_WILDCARD;
            }
            // For each property of the encodingQuery, enumerate
            ENCODING_TOPLEVEL_PROPS.forEach((prop) => {
                if (isWildcard(encQ[prop])) {
                    // Assign default wildcard name and enum values.
                    const defaultWildcardName = getDefaultName(prop) + index;
                    const defaultEnumValues = getDefaultEnumValues(prop, schema, opt);
                    const wildcard = (encQ[prop] = initWildcard(encQ[prop], defaultWildcardName, defaultEnumValues));
                    // Add index of the encoding mapping to the property's wildcard index.
                    wildcardIndex.setEncodingProperty(index, prop, wildcard);
                }
            });
            // For each nested property of the encoding query  (e.g., encQ.bin.maxbins)
            ENCODING_NESTED_PROPS.forEach((prop) => {
                const propObj = encQ[prop.parent]; // the property object e.g., encQ.bin
                if (propObj) {
                    const child = prop.child;
                    if (isWildcard(propObj[child])) {
                        // Assign default wildcard name and enum values.
                        const defaultWildcardName = getDefaultName(prop) + index;
                        const defaultEnumValues = getDefaultEnumValues(prop, schema, opt);
                        const wildcard = (propObj[child] = initWildcard(propObj[child], defaultWildcardName, defaultEnumValues));
                        // Add index of the encoding mapping to the property's wildcard index.
                        wildcardIndex.setEncodingProperty(index, prop, wildcard);
                    }
                }
            });
        });
        // AUTO COUNT
        // Add Auto Count Field
        if (opt.autoAddCount) {
            const channel = {
                name: getDefaultName(Property.CHANNEL) + specQ.encodings.length,
                enum: getDefaultEnumValues(Property.CHANNEL, schema, opt),
            };
            const autoCount = {
                name: getDefaultName(Property.AUTOCOUNT) + specQ.encodings.length,
                enum: [false, true],
            };
            const countEncQ = {
                channel,
                autoCount,
                type: TYPE.QUANTITATIVE,
            };
            specQ.encodings.push(countEncQ);
            const index = specQ.encodings.length - 1;
            // Add index of the encoding mapping to the property's wildcard index.
            wildcardIndex.setEncodingProperty(index, Property.CHANNEL, channel);
            wildcardIndex.setEncodingProperty(index, Property.AUTOCOUNT, autoCount);
        }
        return new SpecQueryModel(specQ, wildcardIndex, schema, opt, {});
    }
    get wildcardIndex() {
        return this._wildcardIndex;
    }
    get schema() {
        return this._schema;
    }
    get specQuery() {
        return this._spec;
    }
    duplicate() {
        return new SpecQueryModel(duplicate(this._spec), this._wildcardIndex, this._schema, this._opt, duplicate(this._assignedWildcardIndex));
    }
    setMark(mark) {
        const name = this._wildcardIndex.mark.name;
        this._assignedWildcardIndex[name] = this._spec.mark = mark;
    }
    resetMark() {
        const wildcard = (this._spec.mark = this._wildcardIndex.mark);
        delete this._assignedWildcardIndex[wildcard.name];
    }
    getMark() {
        return this._spec.mark;
    }
    getEncodingProperty(index, prop) {
        const encQ = this._spec.encodings[index];
        if (isEncodingNestedProp(prop)) {
            // nested encoding property
            return encQ[prop.parent][prop.child];
        }
        return encQ[prop]; // encoding property (non-nested)
    }
    setEncodingProperty(index, prop, value, wildcard) {
        const encQ = this._spec.encodings[index];
        if (prop === Property.CHANNEL && encQ.channel && !isWildcard(encQ.channel)) {
            // If there is an old channel
            this._channelFieldCount[encQ.channel]--;
        }
        if (isEncodingNestedProp(prop)) {
            // nested encoding property
            encQ[prop.parent][prop.child] = value;
        }
        else if (isEncodingNestedParent(prop) && value === true) {
            encQ[prop] = extend({}, encQ[prop], // copy all existing properties
            { enum: undefined, name: undefined } // except name and values to it no longer an wildcard
            );
        }
        else {
            // encoding property (non-nested)
            encQ[prop] = value;
        }
        this._assignedWildcardIndex[wildcard.name] = value;
        if (prop === Property.CHANNEL) {
            // If there is a new channel, make sure it exists and add it to the count.
            this._channelFieldCount[value] = (this._channelFieldCount[value] || 0) + 1;
        }
    }
    resetEncodingProperty(index, prop, wildcard) {
        const encQ = this._spec.encodings[index];
        if (prop === Property.CHANNEL) {
            this._channelFieldCount[encQ.channel]--;
        }
        // reset it to wildcard
        if (isEncodingNestedProp(prop)) {
            // nested encoding property
            encQ[prop.parent][prop.child] = wildcard;
        }
        else {
            // encoding property (non-nested)
            encQ[prop] = wildcard;
        }
        // add remove value that is reset from the assignment map
        delete this._assignedWildcardIndex[wildcard.name];
    }
    channelUsed(channel) {
        // do not include encoding that has autoCount = false because it is not a part of the output spec.
        return this._channelFieldCount[channel] > 0;
    }
    channelEncodingField(channel) {
        const encodingQuery = this.getEncodingQueryByChannel(channel);
        return isFieldQuery(encodingQuery);
    }
    getEncodings() {
        // do not include encoding that has autoCount = false because it is not a part of the output spec.
        return this._spec.encodings.filter((encQ) => !isDisabledAutoCountQuery(encQ));
    }
    getEncodingQueryByChannel(channel) {
        for (const specEncoding of this._spec.encodings) {
            if (specEncoding.channel === channel) {
                return specEncoding;
            }
        }
        return undefined;
    }
    getEncodingQueryByIndex(i) {
        return this._spec.encodings[i];
    }
    isAggregate() {
        return isAggregate(this._spec);
    }
    /**
     * @return The Vega-Lite `StackProperties` object that describes the stack
     * configuration of `this`. Returns `null` if this is not stackable.
     */
    getVlStack() {
        return getVlStack(this._spec);
    }
    /**
     * @return The `StackOffset` specified in `this`, `undefined` if none
     * is specified.
     */
    getStackOffset() {
        return getStackOffset(this._spec);
    }
    /**
     * @return The `ExtendedChannel` in which `stack` is specified in `this`, or
     * `null` if none is specified.
     */
    getStackChannel() {
        return getStackChannel(this._spec);
    }
    toShorthand(groupBy) {
        if (groupBy) {
            if (isString(groupBy)) {
                return getGroupByKey(this.specQuery, groupBy);
            }
            const parsedGroupBy = parseGroupBy(groupBy);
            return specShorthand(this._spec, parsedGroupBy.include, parsedGroupBy.replacer);
        }
        return specShorthand(this._spec);
    }
    /**
     * Convert a query to a Vega-Lite spec if it is completed.
     * @return a Vega-Lite spec if completed, null otherwise.
     */
    toSpec(data) {
        if (isWildcard(this._spec.mark))
            return null;
        const spec = {};
        data = data || this._spec.data;
        if (data) {
            spec.data = data;
        }
        if (this._spec.transform) {
            spec.transform = this._spec.transform;
        }
        spec.mark = this._spec.mark;
        spec.encoding = toEncoding(this.specQuery.encodings, { schema: this._schema, wildcardMode: 'null' });
        if (this._spec.width) {
            spec.width = this._spec.width;
        }
        if (this._spec.height) {
            spec.height = this._spec.height;
        }
        if (this._spec.background) {
            spec.background = this._spec.background;
        }
        if (this._spec.padding) {
            spec.padding = this._spec.padding;
        }
        if (this._spec.title) {
            spec.title = this._spec.title;
        }
        if (spec.encoding === null) {
            return null;
        }
        if (this._spec.config || this._opt.defaultSpecConfig)
            spec.config = extend({}, this._opt.defaultSpecConfig, this._spec.config);
        return spec;
    }
    getRankingScore(rankingName) {
        return this._rankingScore[rankingName];
    }
    setRankingScore(rankingName, score) {
        this._rankingScore[rankingName] = score;
    }
}
//# sourceMappingURL=model.js.map