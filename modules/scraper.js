const Scraper = (function() {
    let _prevMouseEvent;

    function scrape({ rowSelector, columnSelectors }) {
        const data = [];
        const fieldToColumnSelector = {}
        if (rowSelector && columnSelectors) {
            Array.from(document.querySelectorAll(rowSelector))
                .map(rowElement => {
                    const row = {};
                    columnSelectors.forEach((columnSelector, i) => {
                        const field = _indexToAlpha(i);
                        const columnElement = rowElement.querySelector(columnSelector);
                        if (columnElement) {
                            row[field] = columnElement.textContent;
                            fieldToColumnSelector[field] = columnSelector;
                        } else {
                            row[field] = "";
                        }  
                    });
                    data.push(row);
                })
            
        }
        if (data.length) {
            VisualFeedback.highlightRowElements({ rowSelector, columnSelectors });
            Panel.setChartData({ data, fieldToColumnSelector });
        }
    }

    function start() {
        Utils.eventListener({
            element: document.body,
            type: "add",
            event: "mousemove",
            listener: _mouseMoveListener
        });
        Utils.eventListener({
            element: document.body,
            type: "add",
            event: "click",
            listener: _mouseClickListener
        });
        _panelElement = document.querySelector(`web-voyager`).shadowRoot;
    }

    function stop() {
        const element = document.body;
        Utils.eventListener({ element, type: "remove", event: "mousemove", listener: "mouseMove"});
        Utils.eventListener({ element, type: "remove", event: "click", listener: "mouseClick"});
    }

    function _mouseMoveListener(event) {
        if (_ignoreEvent(event)) {
            if (_prevMouseEvent && !_inPanelElement(_prevMouseEvent.target)) {
                _unhighlightCurrentColumn();
            }
            _prevMouseEvent = event;
            return;
        }
        _unhighlightCurrentColumn();
        const { target } = event;
        const wrapperData = WrapperInduction.getWrapperData(target, true);
        VisualFeedback.highlightColumnElements({
            rowSelector: wrapperData.rowSelector,
            columnSelector: wrapperData.currentColumnSelector
        });
        _prevMouseEvent = event;
    }

    function _unhighlightCurrentColumn() {
        const currentColumnSelector = WrapperInduction.currentColumnSelector();
        const { tempRowSelector} = WrapperInduction.getTempRowData();
        if (currentColumnSelector && tempRowSelector) {
            VisualFeedback.unhighlightColumnElements({
                rowSelector: tempRowSelector,
                columnSelector: currentColumnSelector
            });
        } 
    }

    function _mouseClickListener(event) {
        if (_ignoreEvent(event)) {
            return;
        } else if (!event.altKey) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        const wrapperData = WrapperInduction.getWrapperData(event.target, false);
        scrape(wrapperData);
    }

    function _ignoreEvent(event){
        if (!event.target || !document.body.contains(event.target) || _inPanelElement(event.target)) {
            return true;
        }
        return false;
    }

    function _inPanelElement(element) {
        const panelElement = document.querySelector(`web-voyager`);
        return panelElement === element || panelElement.contains(element);
    }
   
    function _indexToAlpha(i) {
        return String.fromCharCode(97 + i).toUpperCase();
    }

    return {
        scrape,
        start,
        stop
    }
})()