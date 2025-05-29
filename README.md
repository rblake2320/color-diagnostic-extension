# Universal Color Diagnostic Tool

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green.svg)](https://developer.chrome.com/docs/extensions/)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/rblake2320/color-diagnostic-extension/releases)

A powerful Chrome extension that diagnoses and resolves color display issues on websites, with specialized support for video streaming platforms.

## 🎯 Overview

The Universal Color Diagnostic Tool helps users identify and fix color-related display problems, including the notorious pink/green video tinting issues on YouTube and other streaming platforms. It provides comprehensive diagnostics and one-click fixes for common color problems.

## ✨ Features

### Core Functionality
- **🔍 Complete Diagnostic Suite**: Analyzes GPU capabilities, display settings, HDR status, and color profiles
- **⚡ Quick Fix Tools**: One-click solutions for common issues:
  - Toggle CSS color filters
  - Clear browser cache
  - Reset page zoom
  - Force page repaint
  - Disable hardware acceleration indicators
  
### Advanced Capabilities
- **📊 Site Analysis**: Detects color modifications, dark mode implementations, and media elements
- **🎬 YouTube Optimization**: Specialized fixes for ambient mode and HDR-related issues
- **📱 Multi-Display Support**: Detects and adapts to different display configurations
- **📋 Export Functionality**: Generate detailed diagnostic reports for technical support

## 🚀 Installation

### From Source (Developer Mode)
1. Clone this repository or download the ZIP file
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the `color-diagnostic-extension` folder
6. The extension icon (🎨) will appear in your toolbar

### Chrome Web Store (Coming Soon)
*This extension will be available on the Chrome Web Store pending review.*

## 📖 Usage Guide

### Basic Usage
1. **Click** the extension icon (🎨) when experiencing color issues
2. **Run** "Complete Diagnostic" to identify problems
3. **Apply** suggested fixes from the Quick Fixes panel
4. **Export** results if you need technical support

### Advanced Features
- **Right-click context menu**: Quick access to color fixes on any page
- **Keyboard shortcuts**: Configure custom shortcuts in Chrome settings
- **Automatic detection**: The extension monitors for color issues in real-time

## 🛠️ Technical Details

### Permissions Required
| Permission | Purpose |
|------------|---------|
| `activeTab` | Analyze the current page's color properties |
| `storage` | Save diagnostic results and user preferences |
| `tabs` | Communicate with browser tabs |
| `scripting` | Inject diagnostic scripts |
| `contextMenus` | Provide right-click menu options |
| `system.display` | Detect display hardware changes |

### Browser Compatibility
- **Minimum Chrome Version**: 88+
- **Recommended**: Chrome 100+ for full feature support
- **Other Browsers**: Not currently supported (Chromium-based browsers may work)

## 🐛 Troubleshooting

### Common Issues

<details>
<summary><strong>Service worker registration failed</strong></summary>

- Ensure all files are present in the extension directory
- Verify `manifest.json` is valid JSON
- Check Chrome DevTools console for specific errors
</details>

<details>
<summary><strong>Icons not displaying</strong></summary>

- Verify icon files exist: `icon16.png`, `icon48.png`, `icon128.png`
- Use the included `iconcreator.html` to regenerate icons
- Clear Chrome's extension cache and reload
</details>

<details>
<summary><strong>Extension not detecting color issues</strong></summary>

- Grant all requested permissions
- Disable conflicting extensions (ad blockers, dark mode extensions)
- Try running in an incognito window
</details>

## 📁 Project Structure

```
color-diagnostic-extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for background tasks
├── content.js            # Content script for page analysis
├── popup.html           # Extension popup interface
├── popup.js             # Popup functionality
├── icon*.png            # Extension icons (16, 48, 128px)
├── test-page.html       # Local testing page
├── LICENSE              # MIT License
├── README.md            # This file
└── CONTRIBUTING.md      # Contribution guidelines
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on:
- Code style and standards
- Testing requirements
- Pull request process
- Bug reporting guidelines

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Chrome Extension documentation and examples
- Open source color analysis libraries
- Community feedback and bug reports

## 📮 Support

- **Issues**: [GitHub Issues](https://github.com/rblake2320/color-diagnostic-extension/issues)
- **Discussions**: [GitHub Discussions](https://github.com/rblake2320/color-diagnostic-extension/discussions)

---

<p align="center">Made with ❤️ by developers who got tired of pink YouTube videos</p>