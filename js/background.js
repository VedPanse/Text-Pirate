// background.js
chrome.contextMenus.create({
    id: "send-to-noter",
    title: "Send to Text Pirate",
    contexts: ["all"],
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "send-to-noter") {
        chrome.tabs.executeScript(tab.id, {
            file: "js/add-to-noter.js",
        });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "openCard" && request.data) {
        const card = request.data;

        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab) {
                chrome.tabs.sendMessage(activeTab.id, {
                    action: "displayCard",
                    data: card,
                });

                chrome.tabs.executeScript(activeTab.id, {
                    file: 'js/searchNews.js',
                }, () => {
                    chrome.tabs.executeScript(activeTab.id, {
                        code: `news('${card.text}, ${card.title}, ${card.comments}');`
                    });
                });

            }
        });
    } else if (request.action === "highlightText") {
        const searchQuery = request.data;
        setTimeout(() => {
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                const activeTab = tabs[0];
                if (activeTab) {
                    chrome.tabs.sendMessage(activeTab.id, {
                        action: "highlight",
                        data: searchQuery,
                    });
                }
            });
        }, 500);
    } else if (request.action === 'executeSearch') {
        // Access the text and link variables
        const text = request.text;
        const link = request.link;

        // Execute the search function

        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            const activeTab = tabs[0];

            if (activeTab) {
                chrome.tabs.executeScript(activeTab.id, {
                    file: 'js/findText.js',
                }, () => {
                    chrome.tabs.executeScript(activeTab.id, {
                        code: `search('${text}');`
                    });
                });
            }
        });
    } else if (request.action === "openDeveloper") {
        chrome.runtime.sendMessage({
            action: "contentOpenDeveloper"
        })
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetchGoogleData' && request.link) {
        // Make the fetch operation here
        fetch(request.link)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                sendResponse({data});
            })
            .catch(error => {
                console.error('Error:', error);
                sendResponse({error: 'Failed to fetch data from Google.'});
            });

        // Return true to indicate that sendResponse will be called asynchronously
        return true;
    }
});