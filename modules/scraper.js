const Scraper = (function() {
   
    function scrape({ rowSelector, columnSelectors }) {
        const data = [];
        if (rowSelector && columnSelectors) {
            Array.from(document.querySelectorAll(rowSelector))
                .map(rowElement => {
                    const row = {};
                    columnSelectors.forEach((columnSelector, i) => {
                        const column = _indexToAlpha(i);
                        const columnElement = rowElement.querySelector(columnSelector);
                        if (columnElement) {
                            row[column] = columnElement.textContent;
                        } else {
                            row[column] = "";
                        }  
                    });
                    data.push(row);
                })
            
        }
        if (data.length) {
            VisualFeedback.highlightRowElements({ rowSelector, columnSelectors });
            Panel.setChartData({ data });
        }
    }

    function start() {
        // Utils.eventListener({
        //     element: document.body,
        //     type: "add",
        //     event: "mousemove",
        //     listener: _mouseMoveListener
        // });
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
        scrape(wrapperData);
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
        const wrapperData = WrapperInduction.getWrapperData(event.target);
        scrape(wrapperData);
        Utils.eventListener({
            element: document.body,
            type: "remove",
            event: "mousemove",
            listener: _mouseMoveListener 
        });
    }

    function _ignoreEvent(event){
        if (!event.target || !document.body.contains(event.target) || _panelElement.contains(event.target)) {
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