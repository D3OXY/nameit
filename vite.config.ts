import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync, mkdirSync, writeFileSync } from "fs";

const createHTML = (title: string, scriptPath: string) => `
<!DOCTYPE html>
<html>
<head>
    <title>${title}</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../assets/styles.css">
</head>
<body>
    <div id="root"></div>
    <script type="module" src="${scriptPath}"></script>
</body>
</html>
`;

// Create a simple 1x1 pixel PNG as a base64 string
const ICON_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

const copyManifest = () => ({
    name: "copy-manifest",
    writeBundle() {
        // Ensure directories exist
        mkdirSync("dist/popup", { recursive: true });
        mkdirSync("dist/options", { recursive: true });
        mkdirSync("dist/assets", { recursive: true });

        // Copy manifest
        copyFileSync("src/manifest.json", "dist/manifest.json");

        // Create HTML files
        writeFileSync("dist/popup/popup.html", createHTML("NameIt", "./popup.js"));
        writeFileSync("dist/options/options.html", createHTML("NameIt Settings", "./options.js"));

        // Create icons
        const iconBuffer = Buffer.from(ICON_BASE64, "base64");
        const sizes = [16, 32, 48, 128];
        sizes.forEach((size) => {
            writeFileSync(`dist/assets/icon${size}.png`, iconBuffer);
        });
    },
});

export default defineConfig({
    plugins: [react(), copyManifest()],
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
    build: {
        outDir: "dist",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                background: resolve(__dirname, "src/background/index.ts"),
                "popup/popup": resolve(__dirname, "src/popup/index.tsx"),
                "options/options": resolve(__dirname, "src/options/index.tsx"),
            },
            output: {
                entryFileNames: (chunkInfo) => {
                    if (chunkInfo.name === "background") {
                        return "background.js";
                    }
                    return "[name].js";
                },
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name?.endsWith(".css")) {
                        return "assets/styles.css";
                    }
                    return "assets/[name].[hash][extname]";
                },
            },
        },
    },
});
