export function isResultTree(item) {
    return item.items !== undefined;
}
export function getTopResultTreeItem(specQuery) {
    let topItem = specQuery.items[0];
    while (topItem && isResultTree(topItem)) {
        topItem = topItem.items[0];
    }
    return topItem;
}
export function mapLeaves(group, f) {
    return Object.assign(Object.assign({}, group), { items: group.items.map((item) => (isResultTree(item) ? mapLeaves(item, f) : f(item))) });
}
//# sourceMappingURL=result.js.map