const WrapperInduction = (() => {
    let _rowElement;
    let _tempRowElement;
    let _rowSelector;
    let _tempRowSelector;
    let _currentColumnSelector;
    let _columnSelectors = new Set([]);
   
    function getWrapperData(node, exploring) {
        if (node) {
            if (!_rowElement && !_rowSelector && _columnSelectors.size === 0) {
                const wrapperData = _createWrapperData(node);
                if (wrapperData) {
                    const { rowElement, rowSelector } = wrapperData;
                    const classSelector = DOMHelpers.generateClassSelectorFrom(node, rowElement, false);
                    const indexSelector = DOMHelpers.generateIndexSelectorFrom(node, rowElement);
                    const selector = classSelector || indexSelector;
                    _currentColumnSelector = selector;
                    if (!exploring) {
                        _rowElement = rowElement;
                        _rowSelector = rowSelector;
                        _columnSelectors.add(selector);
                    } else {
                        _tempRowElement = rowElement;
                        _tempRowSelector = rowSelector;
                    }
                }
            } else if (_rowSelector) {
                const rowElement = DOMHelpers.getParentRowElement({ rowSelector: _rowSelector, node });
                if (rowElement) {
                    const classSelector = DOMHelpers.generateClassSelectorFrom(node, rowElement, false);
                    const indexSelector = DOMHelpers.generateIndexSelectorFrom(node, rowElement);
                    const selector = classSelector || indexSelector;
                    _currentColumnSelector = selector;
                    if (!exploring) {
                        _columnSelectors.add(selector);
                    }
                } else {
                    _currentColumnSelector = null;
                }
            }
        } 
        return {
            rowElement: _rowElement || _tempRowElement,
            rowSelector: _rowSelector || _tempRowSelector,
            columnSelectors: Array.from(_columnSelectors),
            currentColumnSelector: _currentColumnSelector
        }
    }

    function currentColumnSelector(value) {
        if (value) {
            _currentColumnSelector = value;
        }
        return _currentColumnSelector;
    }

    function getTempRowData() {
        return {
            tempRowElement: _tempRowElement,
            tempRowSelector: _tempRowSelector
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
        getWrapperData,
        getTempRowData,
        currentColumnSelector
    }
})();