![NameIt](nameit.png)

# NameIt - Chrome Extension

A Chrome extension that automatically renames downloaded files based on customizable patterns.

## Features

-   Automatically rename downloaded files based on templates
-   Customizable naming patterns with placeholders
-   File type-specific templates
-   Download history logging
-   Simple and intuitive settings interface

## Installation

1. Clone this repository
2. Install dependencies:
    ```bash
    pnpm install
    ```
3. Build the extension:
    ```bash
    pnpm build
    ```
4. Load the extension in Chrome:
    - Open Chrome and go to `chrome://extensions`
    - Enable "Developer mode"
    - Click "Load unpacked"
    - Select the `dist` directory from this project

## Usage

### Available Placeholders

-   `{originalName}` - Original filename without extension
-   `{extension}` - File extension
-   `{date}` - Current date (YYYY-MM-DD)
-   `{time}` - Current time (HH-MM-SS)
-   `{domain}` - Source website domain
-   `{fileType}` - Type of file (document, image, video, etc.)

### Creating Templates

1. Click the extension icon to open the popup
2. Go to Settings
3. Create a new template with your desired pattern
4. Enable/disable templates as needed

### Example Templates

-   `{originalName}_{date}` → `document_2023-12-20.pdf`
-   `{date}_{time}_{domain}_{originalName}` → `2023-12-20_14-30-00_example.com_document.pdf`

## Development

1. Install dependencies:

    ```bash
    pnpm install
    ```

2. Start development server:

    ```bash
    pnpm dev
    ```

3. Load the extension from the `dist` directory

## License

MIT
