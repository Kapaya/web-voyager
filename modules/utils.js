const Utils = (function(){

    function eventListener({ element, type, event, listener, capture = true }) {
        element[`${type}EventListener`](event, listener, capture);
    }

    return {
        eventListener
    }
})();