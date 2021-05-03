const Scraper = (function() {
   
    function scrape({ rowSelector }) {
        const data = [];
        if (rowSelector) {
            Array.from(document.querySelectorAll(rowSelector))
                .map(rowElement => {
                    const leaves = DOMHelpers.getLeafNodes([rowElement]);
                    const row = {};
                    leaves.forEach((leaf, i) => {
                        const column = _indexToAlpha(i);
                        row[column] = leaf.textContent;
                    });
                    data.push(row);
                })
            
        }
        if (data.length) {
            VisualFeedback.highlightRowElements({ rowSelector });
            Panel.setChartData(data);
            Panel.setChartConfig();
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
        _panelElement = document.querySelector(`#${Constants.PANEL_ID}`);
    }

    function stop() {
        const element = document.body;
        Utils.eventListener({ element, type: "remove", event: "mousemove", listener: "mouseMove"});
        Utils.eventListener({ element, type: "remove", event: "click", listener: "mouseClick"});
    }

    function _mouseMoveListener(event) {
        if (_ignoreEvent(event)) {
            return;
        }
        VisualFeedback.unhighlightRowElements();
        Panel.clearChartConfig();
        Panel.clearChartData();
        const { target } = event;
        const wrapperData = WrapperInduction.getWrapperData(target);
        if (wrapperData) {
            scrape(wrapperData);
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
        const wrapperData = WrapperInduction.getWrapperData();
        scrape(wrapperData);
        Utils.eventListener({
            element: document.body,
            type: "remove",
            event: "mousemove",
            listener: _mouseMoveListener 
        });
    }

    function _ignoreEvent(event){
        if (_panelElement.contains(event.target)) {
            return true;
        }
        return false;
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