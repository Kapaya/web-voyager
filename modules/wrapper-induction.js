const WrapperInduction = (() => {
    let _rowElement;
    let _rowSelector;
   
    function getWrapperData(target) {
        if (target) {
            const wrapperData = _createWrapperData(target);
            if (wrapperData) {
                _rowElement = wrapperData.rowElement;
                _rowSelector = wrapperData.rowSelector;
            }
        }
        return {
            rowElement: _rowElement,
            rowSelector: _rowSelector
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