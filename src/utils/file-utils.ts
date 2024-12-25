import { FileType, FileTypes, PlaceholderValue } from "@/types";

const MIME_TYPE_MAPPINGS: Record<string, FileType> = {
    // Documents
    "application/pdf": FileTypes.PDF,
    "application/msword": FileTypes.WORD,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": FileTypes.WORD,
    "application/vnd.ms-excel": FileTypes.EXCEL,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": FileTypes.EXCEL,
    "application/vnd.ms-powerpoint": FileTypes.POWERPOINT,
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": FileTypes.POWERPOINT,
    "text/plain": FileTypes.TEXT,
    "text/csv": FileTypes.TEXT,

    // Images
    "image/jpeg": FileTypes.JPEG,
    "image/png": FileTypes.PNG,
    "image/gif": FileTypes.GIF,
    "image/svg+xml": FileTypes.SVG,
    "image/webp": FileTypes.WEBP,
    "image/": FileTypes.IMAGE,

    // Audio/Video
    "audio/mpeg": FileTypes.MP3,
    "audio/wav": FileTypes.WAV,
    "audio/": FileTypes.AUDIO,
    "video/mp4": FileTypes.MP4,
    "video/": FileTypes.VIDEO,

    // Archives
    "application/zip": FileTypes.ZIP,
    "application/x-rar-compressed": FileTypes.RAR,
    "application/x-7z-compressed": FileTypes["7Z"],
    "application/x-tar": FileTypes.TAR,
    "application/x-compressed": FileTypes.ARCHIVE,

    // Code
    "text/html": FileTypes.HTML,
    "text/css": FileTypes.CSS,
    "application/javascript": FileTypes.JAVASCRIPT,
    "text/javascript": FileTypes.JAVASCRIPT,
    "application/typescript": FileTypes.TYPESCRIPT,
    "text/x-python": FileTypes.PYTHON,
    "text/x-java": FileTypes.JAVA,
};

export const getFileType = (mimeType: string): FileType => {
    // Try exact match first
    const exactMatch = MIME_TYPE_MAPPINGS[mimeType];
    if (exactMatch) return exactMatch;

    // Try prefix match
    const matchedType = Object.entries(MIME_TYPE_MAPPINGS).find(([key]) => mimeType.startsWith(key) && key.endsWith("/"));
    if (matchedType) return matchedType[1];

    // Try to determine type from mime type prefix
    if (mimeType.startsWith("text/")) return FileTypes.TEXT;
    if (mimeType.startsWith("image/")) return FileTypes.IMAGE;
    if (mimeType.startsWith("audio/")) return FileTypes.AUDIO;
    if (mimeType.startsWith("video/")) return FileTypes.VIDEO;
    if (mimeType.startsWith("application/")) return FileTypes.DOCUMENT;

    return FileTypes.OTHER;
};

export const getFileExtension = (filename: string): string => {
    const parts = filename.split(".");
    return parts.length > 1 ? parts.pop()?.toLowerCase() || "" : "";
};

export const sanitizeFileName = (name: string): string => {
    // Replace invalid characters with underscores
    return name.replace(/[<>:"/\\|?*]/g, "_");
};

export const formatDate = (date: Date = new Date()): string => {
    return date.toISOString().split("T")[0];
};

export const formatTime = (date: Date = new Date()): string => {
    return date.toTimeString().split(" ")[0].replace(/:/g, "-");
};

export const formatDateTime = (date: Date = new Date()): string => {
    return date.toISOString().replace(/[:.]/g, "-").slice(0, -5);
};

export const formatMonth = (date: Date = new Date()): string => {
    return date.toLocaleString("default", { month: "long" });
};

export const formatYear = (date: Date = new Date()): string => {
    return date.getFullYear().toString();
};

export const formatTimestamp = (date: Date = new Date()): string => {
    return date.getTime().toString();
};

export const applyTemplate = (template: string, originalName: string, placeholders: PlaceholderValue[]): string => {
    let result = template;
    const extension = getFileExtension(originalName);
    const nameWithoutExt = originalName.slice(0, -(extension.length + 1));
    const now = new Date();

    // Replace built-in placeholders
    const builtInPlaceholders = {
        originalName: nameWithoutExt,
        extension,
        date: formatDate(now),
        time: formatTime(now),
        datetime: formatDateTime(now),
        month: formatMonth(now),
        year: formatYear(now),
        timestamp: formatTimestamp(now),
        random: Math.random().toString(36).substring(2, 8),
    };

    Object.entries(builtInPlaceholders).forEach(([key, value]) => {
        result = result.replace(new RegExp(`{${key}}`, "g"), value);
    });

    // Replace custom placeholders
    placeholders.forEach(({ key, value }) => {
        result = result.replace(new RegExp(`{${key}}`, "g"), value);
    });

    // Ensure the extension is present
    if (!result.endsWith(`.${extension}`)) {
        result += `.${extension}`;
    }

    return sanitizeFileName(result);
};
