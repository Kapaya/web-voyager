import { assert } from 'chai';
import * as CHANNEL from 'vega-lite/build/src/channel';
import * as MARK from 'vega-lite/build/src/mark';
import { DEFAULT_QUERY_CONFIG } from '../src/config';
import { SpecQueryModel } from '../src/model';
import { getTopResultTreeItem, isResultTree } from '../src/result';
import { schema } from './fixture';
describe('ResultGroup', () => {
    function buildSpecQueryModel(specQ) {
        return SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG);
    }
    function buildSpecQueryModelGroup(specQs) {
        const items = specQs.map((specQ) => buildSpecQueryModel(specQ));
        return {
            name: 'a name',
            path: 'path',
            items: items,
        };
    }
    describe('getTopSpecQueryModel', () => {
        it('should get top model', () => {
            const group = buildSpecQueryModelGroup([
                {
                    mark: MARK.BAR,
                    encodings: [{ channel: CHANNEL.X, autoCount: true }],
                },
                {
                    mark: MARK.POINT,
                    encodings: [{ channel: CHANNEL.X, autoCount: true }],
                },
            ]);
            const top = getTopResultTreeItem(group);
            assert.equal(top.getMark(), MARK.BAR);
        });
        it('should get handle nested groups', () => {
            const group = buildSpecQueryModelGroup([
                {
                    mark: MARK.BAR,
                    encodings: [{ channel: CHANNEL.X, autoCount: true }],
                },
            ]);
            const root = {
                name: 'root',
                path: '',
                items: [group],
            };
            const top = getTopResultTreeItem(root);
            assert.equal(top.getMark(), MARK.BAR);
        });
    });
    describe('isResultGroup', () => {
        it('should return true for a SpecQueryModelGroup (ResultGroup<SpecQueryModel>)', () => {
            const group = {
                name: '',
                path: '',
                items: [],
            };
            assert.isTrue(isResultTree(group));
        });
    });
});
//# sourceMappingURL=result.test.js.map