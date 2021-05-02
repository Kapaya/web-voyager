chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch(request.command) {
        case 'start':
            Scraper.start();
            break;
        default:
            break;
    }
});