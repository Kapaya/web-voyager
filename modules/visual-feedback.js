const VisualFeedback = (() => {
    let _rowSelector;
    let _columnSelectors;
    function highlightRowElements({ rowSelector, columnSelectors }) {
        if (_rowSelector) {
            _applyToRowElementClasslist({
                rowSelector: _rowSelector,
                columnSelectors: _columnSelectors,
                operation: 'remove'
            });
        }
        _applyToRowElementClasslist({
            rowSelector,
            columnSelectors,
            operation: 'add',
        });
        _rowSelector = rowSelector;
        _columnSelectors = columnSelectors;
    }

    function unhighlightRowElements() {
        if (_rowSelector & _columnSelectors) {
            _applyToRowElementClasslist({
                rowSelector: _rowSelector,
                columnSelectors: _columnSelectors,
                operation: 'remove'
            });
        }
    }

    function _applyToRowElementClasslist({ rowSelector, columnSelectors, operation }) {
        const rowElements = document.querySelectorAll(rowSelector);
        Array
            .from(rowElements)
            .forEach((rowElement) => {
                rowElement.classList[operation](Constants.ROW_HIGHLIGHT_CLASS);
                columnSelectors.forEach(columnSelector => {
                    const columnElement = rowElement.querySelector(columnSelector);
                    if (columnElement) {
                        columnElement.classList[operation](Constants.COLUMN_HIGHLIGHT_CLASS);
                    }
                });
            });
    }

    return {
        highlightRowElements,
        unhighlightRowElements
    }
})()