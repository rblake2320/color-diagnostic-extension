// Background service worker for color diagnostic extension

// Store detected issues per tab
const tabIssues = new Map();

// Create context menus on startup
chrome.runtime.onStartup.addListener(() => {
    createContextMenus();
});

// Create context menus function
function createContextMenus() {
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: 'diagnoseColorIssue',
            title: 'Diagnose Color Issue',
            contexts: ['page', 'video', 'image']
        });
    });
}

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'colorIssueDetected' || request.action === 'colorIssueUpdate') {
        // Store the issue data for this tab
        if (sender.tab) {
            tabIssues.set(sender.tab.id, {
                url: request.url,
                data: request.data,
                timestamp: Date.now()
            });
            
            // Update badge to show issue detected
            chrome.action.setBadgeText({
                text: '!',
                tabId: sender.tab.id
            });
            
            chrome.action.setBadgeBackgroundColor({
                color: '#ff5252',
                tabId: sender.tab.id
            });
        }
    }
    return true;
});

// Clear badge when tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading') {
        // Clear any previous issues for this tab
        tabIssues.delete(tabId);
        chrome.action.setBadgeText({
            text: '',
            tabId: tabId
        });
    }
});

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
    tabIssues.delete(tabId);
});

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        // Open a welcome page or show instructions
        console.log('Color Diagnostic Extension installed successfully!');
        
        // Create context menus
        createContextMenus();
    } else if (details.reason === 'update') {
        console.log('Color Diagnostic Extension updated to version', chrome.runtime.getManifest().version);
        
        // Recreate context menus on update
        createContextMenus();
    }
});

// Handle context menu clicks - only add listener if API is available
if (chrome.contextMenus && chrome.contextMenus.onClicked) {
    chrome.contextMenus.onClicked.addListener((info, tab) => {
        if (info.menuItemId === 'diagnoseColorIssue') {
            // Open the popup by opening the extension page
            // Note: chrome.action.openPopup() can only be called in response to a user gesture
            chrome.windows.create({
                url: chrome.runtime.getURL('popup.html'),
                type: 'popup',
                width: 520,
                height: 700
            });
        }
    });
}

// Function to get stored issues for a tab
chrome.runtime.onConnect.addListener((port) => {
    if (port.name === 'popup') {
        port.onMessage.addListener((msg) => {
            if (msg.action === 'getTabIssues') {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs[0]) {
                        const issues = tabIssues.get(tabs[0].id);
                        port.postMessage({
                            action: 'tabIssues',
                            data: issues || null
                        });
                    }
                });
            }
        });
    }
});

// Periodic cleanup of old issue data (older than 1 hour)
setInterval(() => {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    
    for (const [tabId, issue] of tabIssues.entries()) {
        if (issue.timestamp < oneHourAgo) {
            tabIssues.delete(tabId);
        }
    }
}, 30 * 60 * 1000); // Run every 30 minutes

// Handle commands (keyboard shortcuts if defined in manifest)
if (chrome.commands && chrome.commands.onCommand) {
    chrome.commands.onCommand.addListener((command) => {
        if (command === 'run-diagnostic') {
            chrome.windows.create({
                url: chrome.runtime.getURL('popup.html'),
                type: 'popup',
                width: 520,
                height: 700
            });
        }
    });
}

// Monitor for changes in display settings (when possible)
if (chrome.system && chrome.system.display && chrome.system.display.onDisplayChanged) {
    chrome.system.display.onDisplayChanged.addListener(() => {
        // Notify all tabs that display settings changed
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {
                if (tab.id) {
                    chrome.tabs.sendMessage(tab.id, {
                        action: 'displaySettingsChanged'
                    }).catch(() => {
                        // Tab might not have content script loaded
                    });
                }
            });
        });
    });
}

console.log('Color Diagnostic Extension: Background service worker loaded');
