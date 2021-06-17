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

    function highlightColumnElements(options) {
        const rowSelector = options.rowSelector || _rowSelector;
        const { columnSelector } = options;
        if (rowSelector && columnSelector) {
            _applyToColumnElementClassList({
                rowSelector,
                columnSelector,
                operation: 'add'
            });
        }
    }

    function unhighlightColumnElements(options) {
        const rowSelector = options.rowSelector || _rowSelector;
        const { columnSelector } = options;
        if (rowSelector && columnSelector) {
            _applyToColumnElementClassList({
                rowSelector,
                columnSelector,
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

    function _applyToColumnElementClassList({ rowSelector, columnSelector, operation }) {
        const rowElements = document.querySelectorAll(rowSelector);
        Array
            .from(rowElements)
            .forEach((rowElement) => {
                const columnElement = rowElement.querySelector(columnSelector);
                if (columnElement) {
                    columnElement.classList[operation](Constants.COLUMN_ACTIVE_CLASS);
                }
            });
    }

    return {
        highlightRowElements,
        unhighlightRowElements,
        highlightColumnElements,
        unhighlightColumnElements
    }
})()