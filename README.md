# ClearDownload

**Download videos from the web. Free, simple, no limits.**

ClearDownload is a Chromium Manifest V3 browser extension that enables downloading videos from various streaming platforms. It features media detection, format selection, and offline-capable architecture with no remote dependencies.

## Independent Project Notice

**ClearDownload is an independent extension and is NOT affiliated with, endorsed by, or derived from Video DownloadHelper.**

- ClearDownload has its own distinct name, branding, and development team
- ClearDownload uses a unique extension ID (different from Video DownloadHelper)
- ClearDownload does not share code, assets, or infrastructure with Video DownloadHelper
- This project was created to provide a free, open alternative for video downloading

## Features

- **Media Detection**: Automatically detects video and audio streams on supported websites
- **Format Selection**: Choose preferred quality (480p, 720p, 1080p, highest)
- **Audio Extraction**: Download audio-only tracks when available
- **Subtitle Support**: Configure preferred subtitle languages
- **Smart Naming**: Automatic file naming based on page metadata
- **Download History**: Optional local history tracking (privacy-respecting)
- **Dark/Light Themes**: Configurable appearance
- **Keyboard Shortcuts**: Quick access via hotkeys
- **Context Menu Integration**: Right-click commands for quick actions
- **Offline Architecture**: No remote configuration fetching; all rulesets are local

## Supported Websites

ClearDownload supports media detection and download from:

- YouTube
- Vimeo
- Facebook
- Instagram
- OK.ru
- VK.com / VK.ru / VKvideo.ru
- Canva
- iQ.com
- Twitcasting
- Bilibili
- Taiav
- Osmosis.org
- Kick
- Chaturbate

## Requirements

- **Browser**: Chromium-based browsers (Chrome, Edge, Brave, etc.)
- **Manifest Version**: MV3 (Manifest V3)
- **Minimum Browser Version**: Chrome 88+ recommended

## Installation

### Option 1: Load Unpacked Extension (Development)

1. Open your browser and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the project root directory containing `manifest.json`

### Option 2: Install from ZIP Release

<<<<<<< HEAD
1. Download the release ZIP file: [ClearDownload-v1.0.0.0.zip](./release/ClearDownload-v1.0.0.0.zip)
=======
1. Download the release ZIP file: [ClearDownload-v1.1.1.zip](./release/ClearDownload-v1.1.1.zip)
>>>>>>> b3568a81ea9f50187203da2d2b3ea13cebd940f4
2. Extract the ZIP to a folder on your computer
3. Follow steps 1-4 from "Load Unpacked Extension" above, selecting the extracted folder

> **Note**: For production deployment, the extension should be packaged as a `.crx` file. See CRX Packaging Status below.

## Usage

### Basic Workflow

1. Navigate to a supported website (e.g., YouTube, Vimeo)
2. Start playing the video (skip ads if present)
3. The extension will automatically detect available media streams
4. Click the extension icon to open the panel/sidebar
5. Select your preferred format and quality
6. Click **Download** to start the download

### Keyboard Shortcuts

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Execute default action | Alt+Down | Ctrl+Shift+Down |
| Open panel/sidebar | Alt+Up | Ctrl+Shift+Up |

### Settings

Access settings via the gear icon in the extension panel:

- **Downloads**: Configure max concurrent downloads, download directory, notifications
- **History**: Enable/disable download history, set retention period
- **Appearance**: Theme (light/dark/system), font size, panel position
- **Behavior**: Context menu integration, preferred quality, audio preferences
- **Subtitles**: Configure preferred subtitle languages

## Permissions Explanation

ClearDownload requests the following permissions:

### Required Permissions

| Permission | Purpose |
|------------|---------|
| `tabs` | Detect active tab URL for media matching |
| `downloads` | Initiate and manage video downloads |
| `scripting` | Inject content scripts for media detection |
| `storage` | Store user settings and preferences |
| `contextMenus` | Add right-click menu options |
| `sidePanel` | Display sidebar interface |
| `offscreen` | Background processing for downloads |
| `declarativeNetRequest` | Modify request headers for media download (session rules only) |

### Optional Permissions

| Permission | Purpose |
|------------|---------|
| `browsingData` | Clear cookies/cache if needed |
| `downloads.open` | Open downloaded files automatically |
| `webRequest` | Monitor network requests for media detection |
| `webNavigation` | Track navigation events |
| `notifications` | Show download completion notifications |

**Note**: `declarativeNetRequest` and `unlimitedStorage` are NOT listed as optional permissions because Chrome does not allow them to be optional. `declarativeNetRequest` is required for header modification functionality.

### Host Permissions

Host permissions are limited to specific domains where media detection is supported. The extension only accesses these sites to inject detection scripts and identify media streams.

## Architecture Overview

```
ClearDownload/
├── manifest.json          # Extension manifest (MV3)
├── _locales/              # Internationalization files
│   └── en/messages.json   # English translations
├── bitmaps/               # Icons and images
├── service/               # Service worker (background)
│   ├── main.js            # Main service worker logic
│   ├── ruleset_manager.js # Local ruleset management
│   └── emscripten-module.wasm  # WASM runtime
├── content/               # UI components (popup, sidebar, history)
│   ├── popup.html         # Main popup interface
│   ├── sidebar.html       # Sidebar interface
│   ├── history.html       # Download history page
│   └── *.js               # UI logic scripts
├── injected/              # Content scripts for each platform
│   ├── youtube.js         # YouTube detection
│   ├── vimeo.js           # Vimeo detection
│   ├── facebook.js        # Facebook detection
│   └── ...                # Other platform scripts
├── factory/               # Download processing
│   ├── factory.html       # Processing interface
│   └── factory.js         # Media processing logic
├── download_worker/       # WebAssembly download engine
│   ├── main.js            # Worker script
│   └── libav-*.wasm*      # FFmpeg WASM binaries
└── local_ruleset/         # Local media detection rules
    └── ruleset-pretty.json
```

### Key Components

#### Service Worker (`service/main.js`)
- Handles background tasks and download orchestration
- Uses local ruleset manager for media pattern matching
- Zero remote dependencies; fully offline-capable

#### Ruleset Manager (`service/ruleset_manager.js`)
- Loads media detection rules from `local_ruleset/ruleset-pretty.json`
- Validates schema and blocks dangerous fields
- Falls back to embedded defaults on failure
- No remote ruleset fetching

#### Content Scripts (`injected/*.js`)
- Platform-specific media detection logic
- Runs in isolated or main world depending on requirements
- Communicates with service worker via messaging

#### Download Worker (`download_worker/`)
- WebAssembly-based media processing using FFmpeg
- Supports H.264, AAC, MP3 codecs
- Enables client-side transcoding and merging

#### WASM Runtime
- `emscripten-module.wasm`: Core processing engine
- `libav-6.5.7.1-h264-aac-mp3.wasm.wasm`: FFmpeg codec library
- All WASM files are bundled locally; no remote loading

## Security & Privacy

### Security Features

- **Local-First Architecture**: No remote configuration fetching
- **Strict Input Validation**: All ruleset data is validated before use
- **Content Security Policy**: Complete CSP with `object-src 'self'`
- **No Remote Dependencies**: All assets bundled locally
- **Narrowed Host Permissions**: Only specific domains allowed

### Privacy Considerations

- **No Tracking**: The extension does not track user activity
- **Local Storage**: All settings and history stored locally
- **Optional History**: Download history is opt-in and can be cleared
- **No Data Collection**: No user data is sent to external servers
- **Anonymous Reporting**: Error reports (if enabled) are anonymous

### What We Don't Do

- ❌ No remote configuration fetching
- ❌ No telemetry or analytics
- ❌ No user data collection
- ❌ No third-party tracking
- ❌ No cryptocurrency mining
- ❌ No DRM circumvention

## Known Limitations

1. **YouTube Downloads**: Chrome Web Store policy prohibits YouTube download functionality. Use Firefox or Microsoft Edge for full YouTube support.

2. **DRM-Protected Content**: The extension cannot download DRM-protected videos. Videos with DRM will be detected and blocked.

3. **Private/Incognito Mode**: The extension must be manually enabled in private browsing mode via extension settings.

4. **Save As Dialog**: Some browsers show a "Save As" dialog after download completion. This is a browser setting that can be disabled.

5. **Network Interruptions**: Downloads may be interrupted by network issues. Partial files may result.

## Development

### Prerequisites

- Node.js (optional, for tooling)
- Python 3 (for packaging scripts)
- Chromium-based browser for testing

### Loading the Extension

1. Open `chrome://extensions/`
2. Enable Developer mode
3. Click "Load unpacked"
4. Select the project root directory

### Testing Checklist

- [ ] Verify no network requests to external domains
- [ ] Test offline functionality
- [ ] Verify media detection on supported sites
- [ ] Check console for errors
- [ ] Test download functionality
- [ ] Verify WASM modules load correctly

### Building the Release Package

A Python packaging script is included:

```bash
python3 package_extension.py
```

This creates a ZIP release in the `release/` directory.

## Release Information

### Current Version: 1.1.1

**Release Date**: 2024

**Changes in v1.1.1**:
- Removed duplicate public key that conflicted with Video DownloadHelper extension ID
- Extension now generates unique ID on installation
- Added independence notice to documentation
- Fixed permission declarations (declarativeNetRequest moved to required permissions)

**Previous Version: 1.1.0**
- Initial independent release

**Release Artifacts:**

<<<<<<< HEAD
- **ZIP Package**: [ClearDownload-v1.0.0.0.zip](./release/ClearDownload-v1.0.0.0.zip)
=======
- **ZIP Package**: [ClearDownload-v1.1.1.zip](./release/ClearDownload-v1.1.1.zip)
>>>>>>> b3568a81ea9f50187203da2d2b3ea13cebd940f4
- **SHA-256 Checksum**: [SHA256SUMS.txt](./release/SHA256SUMS.txt)

**Checksum Verification:**

```bash
cd release
sha256sum -c SHA256SUMS.txt
```

<<<<<<< HEAD
Expected output: `ClearDownload-v1.0.0.0.zip: OK`
=======
Expected output: `ClearDownload-v1.1.1.zip: OK`
>>>>>>> b3568a81ea9f50187203da2d2b3ea13cebd940f4

### CRX Packaging Status

⚠️ **CRX generation is currently blocked.**

**Reason**: A valid private RSA key is required for CRX signing. The previous private key associated with the old public key was mathematically invalid.

**Current Status:**
- ✅ ZIP release generated successfully
- ❌ CRX generation requires valid key pair
- ✅ Extension ID is now unique (no longer conflicts with Video DownloadHelper)

**Important Notes:**

1. **Extension ID**: Without the `"key"` field in manifest.json, Chrome will assign a unique extension ID when loaded unpacked or published to the Chrome Web Store.

2. **For Chrome Web Store Publication**: Submit the ZIP package to the Chrome Web Store Developer Dashboard. Google will handle signing and ID assignment.

3. **For Enterprise Deployment**: Generate a new RSA key pair using Chrome's extension packaging tools, then update manifest.json with the new public key.

## Troubleshooting: Extension Removal Issue

**Problem**: If you previously installed ClearDownload alongside Video DownloadHelper, Chrome may have removed one of them due to ID conflict.

**Solution**: 
1. Remove any existing ClearDownload installation
2. Download the new v1.1.1 release (this version)
3. Install fresh - the extension ID is now unique

The v1.1.1 release removes the `"key"` field from manifest.json, ensuring ClearDownload has a different extension ID than Video DownloadHelper.

## Support

For updates, support, and bug reports, visit: [cleardownload.rf.gd](https://cleardownload.rf.gd)

## License

See project repository for license information.

---

**ClearDownload** - Download videos from the web. Free, simple, no limits.
