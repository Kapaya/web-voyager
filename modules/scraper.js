const Scraper = (function() {
   
    function scrape() {
        const data = [];
        const { rowSelector } = WrapperInduction.getWrapperData();
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
            console.log(data);
        }
    }

    function start() {
        document.body.addEventListener("mousemove", _mouseMoveListener);
        document.body.addEventListener("click", _mouseClickListener)
    }

    function stop() {
        document.body.removeEventListener("mousemove", _mouseMoveListener);
        document.body.removeEventListener("click", _mouseClickListener)
    }

    function _mouseMoveListener(event) {
        VisualFeedback.unhighlightRowElements();
        const { target } = event;
        const wrapperData = WrapperInduction.findRowElement(target);
        if (wrapperData) {
            const { rowSelector } = wrapperData;
            if (rowSelector ) {
                VisualFeedback.highlightRowElements({ rowSelector });
            }
        }
    }

    function _mouseClickListener(event) {
        if (!event.altKey) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        scrape();
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