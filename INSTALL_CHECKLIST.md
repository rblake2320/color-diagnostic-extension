# Chrome Extension Installation Checklist

## ✅ Files Required
- [ ] manifest.json
- [ ] background.js
- [ ] content.js
- [ ] popup.html
- [ ] popup.js
- [ ] icon16.png
- [ ] icon48.png
- [ ] icon128.png

## 🔧 If You See Errors:

### "Service worker registration failed"
1. Close Chrome completely
2. Reopen Chrome
3. Go to chrome://extensions/
4. Remove the extension
5. Click "Load unpacked" again

### "Cannot read properties of undefined"
1. The extension has been updated to fix this
2. Click the refresh button in chrome://extensions/
3. Or remove and reload the extension

### Icons not showing
1. The Python script created basic icons
2. Or open iconcreator.html in Chrome
3. Right-click each icon and save

## 🚀 Quick Start:
1. Open Chrome
2. Type: chrome://extensions/
3. Enable "Developer mode" (top right)
4. Click "Load unpacked"
5. Select this folder
6. Look for the 🎨 icon in toolbar

## 🧪 Test the Extension:
1. Open test-page.html in Chrome
2. Click the extension icon
3. Run "Complete Diagnostic"
4. Try "Toggle CSS Filters" to fix the purple box
5. Test other Quick Fixes

## 📝 Features:
- Diagnostic: Analyzes display and GPU settings
- Quick Fixes: Instant solutions for common issues
- Site Analysis: Detects color problems on any site
- Export: Save diagnostic results as JSON

## 🎯 For YouTube Issues:
1. Go to any YouTube video
2. If you see pink/green colors:
   - Click extension icon
   - Go to "Quick Fixes" tab
   - Click "Toggle CSS Filters"
3. If that doesn't work:
   - Run "Complete Diagnostic"
   - Check for HDR issues
   - Try "Force Page Repaint"

## 💡 Tips:
- Test in Incognito mode to rule out other extensions
- The red "!" badge shows when issues are detected
- Right-click any page and select "Diagnose Color Issue"
- Export results for tech support

## 🆘 Still Having Issues?
1. Make sure Chrome is updated (Help → About Chrome)
2. Disable other extensions temporarily
3. Check Windows display settings for HDR
4. Try the reload-extension.bat file
