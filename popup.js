// Tab switching functionality
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and contents
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        const tabId = tab.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Diagnostic functions
class ColorDiagnostic {
    constructor() {
        this.results = {};
        this.issues = [];
        this.solutions = [];
    }
    
    async runFullDiagnostic() {
        this.showLoading('diagnosticResults');
        this.results = {};
        this.issues = [];
        this.solutions = [];
        
        await this.checkBrowserInfo();
        await this.checkGPUInfo();
        await this.checkColorProfiles();
        await this.checkVideoCodecs();
        await this.checkExtensions();
        await this.analyzeIssues();
        
        this.displayResults();
    }
    
    showLoading(elementId) {
        document.getElementById(elementId).innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Running diagnostic...</p>
            </div>
        `;
    }
    
    async checkBrowserInfo() {
        const ua = navigator.userAgent;
        const browserInfo = {
            userAgent: ua,
            platform: navigator.platform,
            vendor: navigator.vendor,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            doNotTrack: navigator.doNotTrack,
            hardwareConcurrency: navigator.hardwareConcurrency,
            maxTouchPoints: navigator.maxTouchPoints
        };
        
        // Detect browser type
        if (ua.includes('Chrome')) browserInfo.browser = 'Chrome';
        else if (ua.includes('Firefox')) browserInfo.browser = 'Firefox';
        else if (ua.includes('Safari')) browserInfo.browser = 'Safari';
        else if (ua.includes('Edge')) browserInfo.browser = 'Edge';
        else browserInfo.browser = 'Unknown';
        
        this.results.browser = browserInfo;
    }
    
    async checkGPUInfo() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            this.results.gpu = {
                vendor: gl.getParameter(debugInfo ? debugInfo.UNMASKED_VENDOR_WEBGL : gl.VENDOR),
                renderer: gl.getParameter(debugInfo ? debugInfo.UNMASKED_RENDERER_WEBGL : gl.RENDERER),
                webglVersion: gl.getParameter(gl.VERSION),
                shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
                maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
                maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS)
            };
        } else {
            this.results.gpu = { error: 'WebGL not supported' };
            this.issues.push('WebGL not supported - hardware acceleration may be disabled');
        }
    }
    
    async checkColorProfiles() {
        this.results.colorProfiles = {
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth,
            width: screen.width,
            height: screen.height,
            availWidth: screen.availWidth,
            availHeight: screen.availHeight,
            orientation: screen.orientation?.type || 'unknown'
        };
        
        // Check for HDR support
        if (window.matchMedia) {
            this.results.colorProfiles.colorGamut = {
                srgb: window.matchMedia('(color-gamut: srgb)').matches,
                p3: window.matchMedia('(color-gamut: p3)').matches,
                rec2020: window.matchMedia('(color-gamut: rec2020)').matches
            };
            
            this.results.colorProfiles.dynamicRange = {
                standard: window.matchMedia('(dynamic-range: standard)').matches,
                high: window.matchMedia('(dynamic-range: high)').matches
            };
        }
        
        // Check for potential HDR issues
        if (this.results.colorProfiles.dynamicRange?.high) {
            this.issues.push('HDR is enabled - this can cause color issues on some websites');
            this.solutions.push({
                issue: 'HDR Enabled',
                solution: 'Try disabling HDR in Windows Display Settings > HDR'
            });
        }
        
        if (this.results.colorProfiles.colorGamut?.p3 || this.results.colorProfiles.colorGamut?.rec2020) {
            this.issues.push('Wide color gamut display detected - may cause color mapping issues');
            this.solutions.push({
                issue: 'Wide Color Gamut',
                solution: 'Check color profile settings in Windows Color Management'
            });
        }
    }
    
    async checkVideoCodecs() {
        const video = document.createElement('video');
        const codecs = {
            h264: video.canPlayType('video/mp4; codecs="avc1.42E01E"'),
            h265: video.canPlayType('video/mp4; codecs="hev1.1.6.L93.90"'),
            vp8: video.canPlayType('video/webm; codecs="vp8"'),
            vp9: video.canPlayType('video/webm; codecs="vp9"'),
            av1: video.canPlayType('video/mp4; codecs="av01.0.00M.08"')
        };
        
        this.results.videoCodecs = codecs;
        
        // Check if any codecs are missing
        if (!codecs.h264 || codecs.h264 === '') {
            this.issues.push('H.264 codec not supported - may affect video playback');
        }
    }
    
    async checkExtensions() {
        // Get current tab to check for active extensions
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // Send message to content script to check for color-modifying elements
        chrome.tabs.sendMessage(tab.id, { action: 'checkColorModifications' }, (response) => {
            if (response && response.colorModifications) {
                this.results.siteColorMods = response.colorModifications;
                if (response.colorModifications.hasFilters) {
                    this.issues.push('CSS filters detected on the page');
                    this.solutions.push({
                        issue: 'CSS Filters',
                        solution: 'Use the "Toggle CSS Filters" quick fix'
                    });
                }
            }
        });
    }
    
    async analyzeIssues() {
        // Check for common extension conflicts
        const suspiciousExtensions = [
            'dark reader', 'dark mode', 'night eye', 'turn off the lights',
            'f.lux', 'blue light', 'eye care', 'color enhancer'
        ];
        
        // Note: We can't directly access other extensions, but we can suggest checking
        this.solutions.push({
            issue: 'Extension Conflicts',
            solution: 'Test in incognito mode (Ctrl+Shift+N) to rule out extension issues'
        });
    }
    
    displayResults() {
        const resultsDiv = document.getElementById('diagnosticResults');
        let html = '<h3>Diagnostic Results</h3>';
        
        // Browser Info
        html += '<div class="diagnostic-section">';
        html += '<h3>Browser Information</h3>';
        html += `<div class="diagnostic-item">
            <span class="diagnostic-label">Browser:</span>
            <span class="diagnostic-value">${this.results.browser?.browser || 'Unknown'}</span>
        </div>`;
        html += `<div class="diagnostic-item">
            <span class="diagnostic-label">Platform:</span>
            <span class="diagnostic-value">${this.results.browser?.platform || 'Unknown'}</span>
        </div>`;
        html += '</div>';
        
        // GPU Info
        if (this.results.gpu) {
            html += '<div class="diagnostic-section">';
            html += '<h3>GPU Information</h3>';
            html += `<div class="diagnostic-item">
                <span class="diagnostic-label">Renderer:</span>
                <span class="diagnostic-value">${this.results.gpu.renderer || 'Unknown'}</span>
            </div>`;
            html += '</div>';
        }
        
        // Color Profile Info
        html += '<div class="diagnostic-section">';
        html += '<h3>Display Information</h3>';
        html += `<div class="diagnostic-item">
            <span class="diagnostic-label">Color Depth:</span>
            <span class="diagnostic-value">${this.results.colorProfiles?.colorDepth || 'Unknown'} bit</span>
        </div>`;
        if (this.results.colorProfiles?.dynamicRange?.high) {
            html += `<div class="diagnostic-item">
                <span class="diagnostic-label">HDR:</span>
                <span class="diagnostic-value status-warning">Enabled</span>
            </div>`;
        }
        html += '</div>';
        
        // Issues Found
        if (this.issues.length > 0) {
            html += '<div class="issue-found">';
            html += '<h4>Issues Found:</h4>';
            html += '<ul>';
            this.issues.forEach(issue => {
                html += `<li>${issue}</li>`;
            });
            html += '</ul>';
            html += '</div>';
        }
        
        // Solutions
        if (this.solutions.length > 0) {
            html += '<div class="solution">';
            html += '<h4>Recommended Solutions:</h4>';
            this.solutions.forEach(sol => {
                html += `<p><strong>${sol.issue}:</strong> ${sol.solution}</p>`;
            });
            html += '</div>';
        }
        
        resultsDiv.innerHTML = html;
    }
    
    exportResults() {
        const data = {
            timestamp: new Date().toISOString(),
            results: this.results,
            issues: this.issues,
            solutions: this.solutions
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `color-diagnostic-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize diagnostic
const diagnostic = new ColorDiagnostic();

// Button event listeners
document.getElementById('runDiagnostic').addEventListener('click', () => {
    diagnostic.runFullDiagnostic();
});

document.getElementById('exportResults').addEventListener('click', () => {
    diagnostic.exportResults();
});

// Quick Fixes
document.getElementById('clearCache').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: 'clearCache' }, (response) => {
        document.getElementById('quickFixResults').innerHTML = 
            '<div class="solution"><p>Cache cleared! Refresh the page to see changes.</p></div>';
    });
});

document.getElementById('resetZoom').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.setZoom(tab.id, 1.0);
    document.getElementById('quickFixResults').innerHTML = 
        '<div class="solution"><p>Zoom level reset to 100%</p></div>';
});

document.getElementById('toggleFilters').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: 'toggleFilters' }, (response) => {
        document.getElementById('quickFixResults').innerHTML = 
            '<div class="solution"><p>CSS filters toggled!</p></div>';
    });
});

document.getElementById('forceRepaint').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: 'forceRepaint' }, (response) => {
        document.getElementById('quickFixResults').innerHTML = 
            '<div class="solution"><p>Page repainted!</p></div>';
    });
});

document.getElementById('disableExtensions').addEventListener('click', () => {
    document.getElementById('quickFixResults').innerHTML = 
        '<div class="solution"><p>To test without extensions: Press Ctrl+Shift+N (Windows) or Cmd+Shift+N (Mac) to open an incognito window.</p></div>';
});

// Site Analysis
document.getElementById('analyzeSite').addEventListener('click', async () => {
    document.getElementById('siteResults').innerHTML = '<div class="loading"><div class="spinner"></div><p>Analyzing site...</p></div>';
    
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: 'analyzeSite' }, (response) => {
        if (response && response.analysis) {
            let html = '<h3>Site Analysis</h3>';
            html += '<div class="diagnostic-section">';
            
            html += `<div class="diagnostic-item">
                <span class="diagnostic-label">URL:</span>
                <span class="diagnostic-value">${response.analysis.url}</span>
            </div>`;
            
            if (response.analysis.hasColorFilters) {
                html += `<div class="diagnostic-item">
                    <span class="diagnostic-label">Color Filters:</span>
                    <span class="diagnostic-value status-warning">Detected</span>
                </div>`;
            }
            
            if (response.analysis.hasDarkMode) {
                html += `<div class="diagnostic-item">
                    <span class="diagnostic-label">Dark Mode:</span>
                    <span class="diagnostic-value">Active</span>
                </div>`;
            }
            
            html += `<div class="diagnostic-item">
                <span class="diagnostic-label">Media Elements:</span>
                <span class="diagnostic-value">${response.analysis.mediaCount} found</span>
            </div>`;
            
            html += '</div>';
            document.getElementById('siteResults').innerHTML = html;
        }
    });
});