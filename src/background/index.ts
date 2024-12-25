import type { FileTemplate, RenameHistory } from "@/types";
import { getFileNameParts, truncateFileName, sanitizeFileName } from "@/utils/filename";
import { storage } from "@/utils/storage";

function findMatchingTemplate(templates: FileTemplate[], extension: string): FileTemplate | undefined {
    if (!templates || !Array.isArray(templates) || templates.length === 0) return undefined;

    return templates.find((template) => {
        if (!template) return false;
        if (typeof template.enabled !== "boolean") return false;
        if (!template.enabled) return false;
        if (!Array.isArray(template.fileTypes)) return false;

        return template.fileTypes.length === 0 || template.fileTypes.includes(extension.toLowerCase());
    });
}

function extractDomain(url: string): string {
    try {
        if (!url || url === "") return "unknown";

        // Handle data URLs
        if (url.startsWith("data:")) return "local";

        // Handle blob URLs
        if (url.startsWith("blob:")) return "local";

        // Handle file URLs
        if (url.startsWith("file:")) return "local";

        const urlObj = new URL(url);
        // Remove www. prefix and sanitize domain
        const domain = urlObj.hostname
            .replace(/^www\./, "")
            .replace(/[<>:"/\\|?*]/g, "_")
            .toLowerCase();

        return domain || "unknown";
    } catch {
        return "unknown";
    }
}

chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
    // Return true to indicate we'll call suggest asynchronously
    storage
        .getSettings()
        .then((settings) => {
            try {
                const { templates, truncateOptions } = settings;

                // Get original filename parts
                const originalFileName = downloadItem.filename.split(/[/\\]/).pop() || "";
                const { name: originalName, extension } = getFileNameParts(originalFileName);

                // Find matching template
                const matchingTemplate = findMatchingTemplate(templates, extension);
                if (!matchingTemplate) {
                    suggest();
                    return;
                }

                // If truncation is enabled and the pattern uses {originalName}, truncate it
                const truncatedOriginalName = truncateFileName(originalName, truncateOptions);

                // Get domain from referrer or download URL
                const domain = extractDomain(downloadItem.referrer || downloadItem.url || "");

                // Process the template
                const now = new Date();
                const variables = {
                    originalName: truncatedOriginalName,
                    date: now.toISOString().split("T")[0],
                    time: now.toTimeString().split(" ")[0].replace(/:/g, "-"),
                    timestamp: Math.floor(now.getTime() / 1000).toString(),
                    random: Math.random().toString(36).substring(2, 8),
                    domain,
                };

                // Generate new filename
                const newName = matchingTemplate.pattern.replace(/{(\w+)}/g, (match, key) => {
                    const value = variables[key as keyof typeof variables];
                    return value || match;
                });

                // Construct full new filename with extension and ensure it's safe
                const newFileName = sanitizeFileName(extension ? `${newName}.${extension}` : newName);

                // Suggest the new filename
                suggest({ filename: newFileName });

                // Add to history
                const historyItem: RenameHistory = {
                    id: downloadItem.id.toString(),
                    originalName: originalFileName,
                    newName: newFileName,
                    templateId: matchingTemplate.id,
                    timestamp: now.getTime(),
                    fileType: extension.toLowerCase() as any,
                };

                storage.addToHistory(historyItem).catch(console.error);
            } catch (error) {
                console.error("Error processing download:", error);
                suggest();
            }
        })
        .catch((error) => {
            console.error("Error getting settings:", error);
            suggest();
        });

    return true; // Indicate we'll call suggest asynchronously
});
