export interface FileTemplate {
    id: string;
    name: string;
    pattern: string;
    fileTypes: string[];
    enabled: boolean;
}

export interface Settings {
    templates: FileTemplate[];
    truncateOptions: {
        enabled: boolean;
        maxLength: number;
        truncatePosition: "start" | "middle" | "end";
        truncateIndicator: string;
    };
    defaultTemplate: string;
    enableLogging: boolean;
}

export const FileTypes = {
    // Documents
    DOCUMENT: "document",
    PDF: "pdf",
    WORD: "word",
    EXCEL: "excel",
    POWERPOINT: "powerpoint",
    TEXT: "text",

    // Images
    IMAGE: "image",
    JPEG: "jpeg",
    PNG: "png",
    GIF: "gif",
    SVG: "svg",
    WEBP: "webp",

    // Audio/Video
    AUDIO: "audio",
    VIDEO: "video",
    MP3: "mp3",
    MP4: "mp4",
    WAV: "wav",

    // Archives
    ARCHIVE: "archive",
    ZIP: "zip",
    RAR: "rar",
    "7Z": "7z",
    TAR: "tar",

    // Code
    CODE: "code",
    HTML: "html",
    CSS: "css",
    JAVASCRIPT: "javascript",
    TYPESCRIPT: "typescript",
    PYTHON: "python",
    JAVA: "java",

    // Other
    OTHER: "other",
} as const;

export type FileType = (typeof FileTypes)[keyof typeof FileTypes];

export interface RenameHistory {
    id: string;
    originalName: string;
    newName: string;
    timestamp: number;
    fileType: FileType;
    templateId: string;
}

export interface PlaceholderValue {
    key: string;
    value: string;
}

export interface RenameResult {
    success: boolean;
    newName?: string;
    error?: string;
}
