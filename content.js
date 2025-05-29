// Content script for color diagnostic extension
// This runs on every webpage and can analyze/modify the page

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'checkColorModifications') {
        const colorMods = analyzeColorModifications();
        sendResponse({ colorModifications: colorMods });
    } else if (request.action === 'clearCache') {
        clearSiteCache();
        sendResponse({ success: true });
    } else if (request.action === 'toggleFilters') {
        toggleCSSFilters();
        sendResponse({ success: true });
    } else if (request.action === 'forceRepaint') {
        forcePageRepaint();
        sendResponse({ success: true });
    } else if (request.action === 'analyzeSite') {
        const analysis = performSiteAnalysis();
        sendResponse({ analysis: analysis });
    }
    return true; // Keep message channel open for async response
});

// Analyze color modifications on the page
function analyzeColorModifications() {
    const mods = {
        hasFilters: false,
        filters: [],
        hasDarkMode: false,
        hasColorOverlays: false,
        customStyles: []
    };
    
    // Check all elements for CSS filters
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
        const computed = window.getComputedStyle(el);
        
        // Check for filters
        if (computed.filter && computed.filter !== 'none') {
            mods.hasFilters = true;
            mods.filters.push({
                element: el.tagName,
                filter: computed.filter
            });
        }
        
        // Check for color modifications
        if (computed.mixBlendMode && computed.mixBlendMode !== 'normal') {
            mods.hasColorOverlays = true;
        }
    });
    
    // Check for dark mode indicators
    if (document.documentElement.classList.contains('dark') ||
        document.body.classList.contains('dark-mode') ||
        document.body.classList.contains('dark-theme')) {
        mods.hasDarkMode = true;
    }
    
    // Check for YouTube-specific modifications
    if (window.location.hostname.includes('youtube.com')) {
        const ytDarkMode = document.documentElement.getAttribute('dark') === 'true';
        if (ytDarkMode) mods.hasDarkMode = true;
        
        // Check for ambient mode
        const cinematics = document.querySelector('#cinematics');
        if (cinematics && cinematics.style.display !== 'none') {
            mods.customStyles.push('YouTube Ambient Mode detected');
        }
    }
    
    return mods;
}

// Clear site-specific cache
function clearSiteCache() {
    // Clear localStorage
    try {
        localStorage.clear();
    } catch (e) {
        console.log('Could not clear localStorage:', e);
    }
    
    // Clear sessionStorage
    try {
        sessionStorage.clear();
    } catch (e) {
        console.log('Could not clear sessionStorage:', e);
    }
    
    // Clear cookies for this site
    document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
}

// Toggle CSS filters on/off
function toggleCSSFilters() {
    const filterToggleId = 'color-diagnostic-filter-override';
    let styleEl = document.getElementById(filterToggleId);
    
    if (styleEl) {
        // Remove the override to re-enable filters
        styleEl.remove();
    } else {
        // Add override to disable all filters
        styleEl = document.createElement('style');
        styleEl.id = filterToggleId;
        styleEl.textContent = `
            * {
                filter: none !important;
                -webkit-filter: none !important;
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
                mix-blend-mode: normal !important;
                opacity: 1 !important;
            }
            
            /* YouTube specific fixes */
            #cinematics, .ytp-gradient-top, .ytp-gradient-bottom {
                display: none !important;
            }
            
            .ytp-swatch-background-color {
                background-color: #000 !important;
            }
            
            /* Fix video element directly */
            video {
                filter: none !important;
                -webkit-filter: none !important;
                transform: none !important;
            }
            
            /* Disable common dark mode filters */
            html, body {
                filter: none !important;
                background-blend-mode: normal !important;
            }
            
            /* Reset color matrix filters */
            svg filter, svg feColorMatrix {
                display: none !important;
            }
        `;
        document.head.appendChild(styleEl);
    }
}

// Force page repaint
function forcePageRepaint() {
    // Method 1: Toggle display
    document.documentElement.style.display = 'none';
    document.documentElement.offsetHeight; // Trigger reflow
    document.documentElement.style.display = '';
    
    // Method 2: Add and remove a class
    document.body.classList.add('force-repaint');
    setTimeout(() => {
        document.body.classList.remove('force-repaint');
    }, 100);
    
    // Method 3: Modify transform
    const originalTransform = document.body.style.transform;
    document.body.style.transform = 'translateZ(0)';
    setTimeout(() => {
        document.body.style.transform = originalTransform;
    }, 100);
}

// Perform comprehensive site analysis
function performSiteAnalysis() {
    const analysis = {
        url: window.location.href,
        hostname: window.location.hostname,
        hasColorFilters: false,
        hasDarkMode: false,
        hasVideoElements: false,
        mediaCount: 0,
        potentialIssues: []
    };
    
    // Check for filters
    const allElements = document.querySelectorAll('*');
    let filterCount = 0;
    
    allElements.forEach(el => {
        const computed = window.getComputedStyle(el);
        if (computed.filter && computed.filter !== 'none') {
            filterCount++;
        }
    });
    
    if (filterCount > 0) {
        analysis.hasColorFilters = true;
        analysis.potentialIssues.push(`${filterCount} elements with CSS filters`);
    }
    
    // Check for dark mode
    const darkModeClasses = ['dark', 'dark-mode', 'dark-theme', 'night-mode'];
    const htmlClasses = document.documentElement.className.toLowerCase();
    const bodyClasses = document.body.className.toLowerCase();
    
    darkModeClasses.forEach(cls => {
        if (htmlClasses.includes(cls) || bodyClasses.includes(cls)) {
            analysis.hasDarkMode = true;
        }
    });
    
    // Check for media elements
    const videos = document.querySelectorAll('video');
    const iframes = document.querySelectorAll('iframe');
    
    analysis.mediaCount = videos.length + iframes.length;
    if (videos.length > 0) {
        analysis.hasVideoElements = true;
        analysis.potentialIssues.push(`${videos.length} video elements found`);
    }
    
    // YouTube-specific checks
    if (window.location.hostname.includes('youtube.com')) {
        // Check for HDR video
        const videoEl = document.querySelector('video');
        if (videoEl) {
            const qualityLabel = document.querySelector('.ytp-quality-badge');
            if (qualityLabel && qualityLabel.textContent.includes('HDR')) {
                analysis.potentialIssues.push('HDR video detected');
            }
        }
        
        // Check ambient mode
        const cinematics = document.querySelector('#cinematics');
        if (cinematics && window.getComputedStyle(cinematics).display !== 'none') {
            analysis.potentialIssues.push('YouTube Ambient Mode is active');
        }
    }
    
    // Check for color profile meta tags
    const colorScheme = document.querySelector('meta[name="color-scheme"]');
    if (colorScheme) {
        analysis.potentialIssues.push(`Color scheme meta tag: ${colorScheme.content}`);
    }
    
    return analysis;
}

// Auto-detect and report color issues on page load
window.addEventListener('load', () => {
    const mods = analyzeColorModifications();
    
    // Send initial analysis to background script
    if (mods.hasFilters || mods.hasDarkMode || mods.hasColorOverlays) {
        chrome.runtime.sendMessage({
            action: 'colorIssueDetected',
            data: mods,
            url: window.location.href
        });
    }
});

// Monitor for dynamic changes
const observer = new MutationObserver((mutations) => {
    // Check if any mutations affected filters or colors
    let checkNeeded = false;
    
    mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'style' || 
             mutation.attributeName === 'class')) {
            checkNeeded = true;
        }
    });
    
    if (checkNeeded) {
        // Debounce the check
        clearTimeout(window.colorCheckTimeout);
        window.colorCheckTimeout = setTimeout(() => {
            const mods = analyzeColorModifications();
            if (mods.hasFilters || mods.hasColorOverlays) {
                chrome.runtime.sendMessage({
                    action: 'colorIssueUpdate',
                    data: mods,
                    url: window.location.href
                });
            }
        }, 500);
    }
});

// Start observing
observer.observe(document.documentElement, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: ['style', 'class']
});

console.log('Color Diagnostic Extension: Content script loaded');