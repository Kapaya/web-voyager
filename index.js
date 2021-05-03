chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch(request.command) {
        case 'start':
            Panel.render();
            Scraper.start();
            break;
        default:
            break;
    }
});