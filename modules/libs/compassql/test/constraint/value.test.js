import { assert } from 'chai';
import * as CHANNEL from 'vega-lite/build/src/channel';
import { DEFAULT_QUERY_CONFIG } from '../../src/config';
import { VALUE_CONSTRAINT_INDEX } from '../../src/constraint/value';
import { PropIndex } from '../../src/propindex';
import { extend } from '../../src/util';
import { schema } from '../fixture';
describe('constraints/value', () => {
    const CONSTRAINT_MANUALLY_SPECIFIED_CONFIG = extend({}, DEFAULT_QUERY_CONFIG, {
        constraintManuallySpecifiedValue: true,
    });
    describe('Value Constraint Checks', () => {
        it('should return true if value is not a constant', () => {
            const validValueQ = {
                value: 'color',
                channel: CHANNEL.COLOR,
            };
            assert.isTrue(VALUE_CONSTRAINT_INDEX['doesNotSupportConstantValue'].satisfy(validValueQ, schema, new PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
        });
        it('should return false if value is a constant', () => {
            ['row', 'column', 'x', 'y', 'detail'].forEach((channel) => {
                const invalidValueQ = {
                    value: channel,
                    channel,
                };
                assert.isFalse(VALUE_CONSTRAINT_INDEX['doesNotSupportConstantValue'].satisfy(invalidValueQ, schema, new PropIndex(), CONSTRAINT_MANUALLY_SPECIFIED_CONFIG));
            });
        });
    });
});
//# sourceMappingURL=value.test.js.map