import * as CHANNEL from 'vega-lite/build/src/channel';
import { hasDiscreteDomain } from 'vega-lite/build/src/scale';
import * as TYPE from 'vega-lite/build/src/type';
import { isFieldQuery, scaleType } from './query/encoding';
import { ExpandedType } from './query/expandedtype';
export function stylize(answerSet, schema, opt) {
    const encQIndex = {};
    answerSet = answerSet.map(function (specM) {
        if (opt.smallRangeStepForHighCardinalityOrFacet) {
            specM = smallRangeStepForHighCardinalityOrFacet(specM, schema, encQIndex, opt);
        }
        if (opt.nominalColorScaleForHighCardinality) {
            specM = nominalColorScaleForHighCardinality(specM, schema, encQIndex, opt);
        }
        if (opt.xAxisOnTopForHighYCardinalityWithoutColumn) {
            specM = xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, encQIndex, opt);
        }
        return specM;
    });
    return answerSet;
}
export function smallRangeStepForHighCardinalityOrFacet(specM, schema, encQIndex, opt) {
    [CHANNEL.ROW, CHANNEL.Y, CHANNEL.COLUMN, CHANNEL.X].forEach((channel) => {
        encQIndex[channel] = specM.getEncodingQueryByChannel(channel);
    });
    const yEncQ = encQIndex[CHANNEL.Y];
    if (yEncQ !== undefined && isFieldQuery(yEncQ)) {
        if (encQIndex[CHANNEL.ROW] ||
            schema.cardinality(yEncQ) > opt.smallRangeStepForHighCardinalityOrFacet.maxCardinality) {
            // We check for undefined rather than
            // yEncQ.scale = yEncQ.scale || {} to cover the case where
            // yEncQ.scale has been set to false/null.
            // This prevents us from incorrectly overriding scale and
            // assigning a rangeStep when scale is set to false.
            if (yEncQ.scale === undefined) {
                yEncQ.scale = {};
            }
            // We do not want to assign a rangeStep if scale is set to false
            // and we only apply this if the scale is (or can be) an ordinal scale.
            const yScaleType = scaleType(yEncQ);
            if (yEncQ.scale && (yScaleType === undefined || hasDiscreteDomain(yScaleType))) {
                if (!specM.specQuery.height) {
                    specM.specQuery.height = { step: 12 };
                }
            }
        }
    }
    const xEncQ = encQIndex[CHANNEL.X];
    if (isFieldQuery(xEncQ)) {
        if (encQIndex[CHANNEL.COLUMN] ||
            schema.cardinality(xEncQ) > opt.smallRangeStepForHighCardinalityOrFacet.maxCardinality) {
            // Just like y, we don't want to do this if scale is null/false
            if (xEncQ.scale === undefined) {
                xEncQ.scale = {};
            }
            // We do not want to assign a rangeStep if scale is set to false
            // and we only apply this if the scale is (or can be) an ordinal scale.
            const xScaleType = scaleType(xEncQ);
            if (xEncQ.scale && (xScaleType === undefined || hasDiscreteDomain(xScaleType))) {
                if (!specM.specQuery.width) {
                    specM.specQuery.width = { step: 12 };
                }
            }
        }
    }
    return specM;
}
export function nominalColorScaleForHighCardinality(specM, schema, encQIndex, opt) {
    encQIndex[CHANNEL.COLOR] = specM.getEncodingQueryByChannel(CHANNEL.COLOR);
    const colorEncQ = encQIndex[CHANNEL.COLOR];
    if (isFieldQuery(colorEncQ) &&
        colorEncQ !== undefined &&
        (colorEncQ.type === TYPE.NOMINAL || colorEncQ.type === ExpandedType.KEY) &&
        schema.cardinality(colorEncQ) > opt.nominalColorScaleForHighCardinality.maxCardinality) {
        if (colorEncQ.scale === undefined) {
            colorEncQ.scale = {};
        }
        if (colorEncQ.scale) {
            if (!colorEncQ.scale.range) {
                colorEncQ.scale.scheme = opt.nominalColorScaleForHighCardinality.palette;
            }
        }
    }
    return specM;
}
export function xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, encQIndex, opt) {
    [CHANNEL.COLUMN, CHANNEL.X, CHANNEL.Y].forEach((channel) => {
        encQIndex[channel] = specM.getEncodingQueryByChannel(channel);
    });
    if (encQIndex[CHANNEL.COLUMN] === undefined) {
        const xEncQ = encQIndex[CHANNEL.X];
        const yEncQ = encQIndex[CHANNEL.Y];
        if (isFieldQuery(xEncQ) &&
            isFieldQuery(yEncQ) &&
            yEncQ !== undefined &&
            yEncQ.field &&
            hasDiscreteDomain(scaleType(yEncQ))) {
            if (xEncQ !== undefined) {
                if (schema.cardinality(yEncQ) > opt.xAxisOnTopForHighYCardinalityWithoutColumn.maxCardinality) {
                    if (xEncQ.axis === undefined) {
                        xEncQ.axis = {};
                    }
                    if (xEncQ.axis && !xEncQ.axis.orient) {
                        xEncQ.axis.orient = 'top';
                    }
                }
            }
        }
    }
    return specM;
}
//# sourceMappingURL=stylize.js.map