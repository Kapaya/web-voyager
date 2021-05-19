const WrapperInduction = (() => {
    let _rowElement;
    let _rowSelector;
    let _columnSelectors = new Set([]);
   
    function getWrapperData(node) {
        if (node) {
            if (!_rowElement && !_rowSelector && _columnSelectors.size === 0) {
                const wrapperData = _createWrapperData(node);
                if (wrapperData) {
                    _rowElement = wrapperData.rowElement;
                    _rowSelector = wrapperData.rowSelector;
                    const classSelector = DOMHelpers.generateClassSelectorFrom(node, _rowElement, false);
                    const indexSelector = DOMHelpers.generateIndexSelectorFrom(node, _rowElement);
                    const selector = classSelector || indexSelector;
                    _columnSelectors.add(selector);
                }
            } else if (_rowSelector) {
                const rowElement = DOMHelpers.getParentRowElement({ rowSelector: _rowSelector, node });
                if (rowElement) {
                    const classSelector = DOMHelpers.generateClassSelectorFrom(node, rowElement, false);
                    const indexSelector = DOMHelpers.generateIndexSelectorFrom(node, rowElement);
                    const selector = classSelector || indexSelector;
                    _columnSelectors.add(selector);
                }
            }
        } 
        return {
            rowElement: _rowElement,
            rowSelector: _rowSelector,
            columnSelectors: Array.from(_columnSelectors)
        }
    }

    function _createWrapperData(node) {
        const candidates = [];
        let candidate = node.parentNode;
        let selector = DOMHelpers.generateIndexSelectorFrom(node, candidate);
        while (candidate && document.body.contains(candidate)) {
            const candidateEntry = {
                candidate,
                score: 0
            };
            let nextSibling = candidate.nextElementSibling;
            let previousSibling = candidate.previousElementSibling;
            while (nextSibling) {
                if (nextSibling.querySelector(selector)) {
                    candidateEntry.score += 1;
                }
                nextSibling = nextSibling.nextElementSibling;
            }
            while (previousSibling) {
                if (previousSibling.querySelector(selector)) {
                    candidateEntry.score += 1;
                }
                previousSibling = previousSibling.previousElementSibling;
            }
            candidates.push(candidateEntry);
            candidate = candidate.parentNode;
            selector = DOMHelpers.generateIndexSelectorFrom(node, candidate);
        }
        if (candidates.length) {
            candidates.sort((a, b) => b.score - a.score);
            const rowElement = candidates[0].candidate;
            const rowSelector = DOMHelpers.generateClassSelectorFrom(rowElement, document.querySelector('body'), true);
           
            return {
                rowElement,
                rowSelector
            };
        }
        return null; 
    }

    return {
        getWrapperData
    }
})();