import type { Settings } from "@/types";

export function sanitizeFileName(name: string): string {
    return name.replace(/[<>:"/\\|?*]/g, "_");
}

export function truncateFileName(fileName: string, options: Settings["truncateOptions"]): string {
    if (!options.enabled || fileName.length <= options.maxLength) {
        return fileName;
    }

    const { maxLength, truncatePosition, truncateIndicator } = options;
    const extension = fileName.includes(".") ? "." + fileName.split(".").pop() : "";
    const nameWithoutExt = fileName.slice(0, fileName.length - extension.length);

    if (nameWithoutExt.length <= maxLength) {
        return fileName;
    }

    const indicatorLength = truncateIndicator.length;
    const remainingLength = maxLength - indicatorLength;

    switch (truncatePosition) {
        case "start":
            return truncateIndicator + nameWithoutExt.slice(-remainingLength) + extension;
        case "end":
            return nameWithoutExt.slice(0, remainingLength) + truncateIndicator + extension;
        case "middle":
            const halfLength = Math.floor(remainingLength / 2);
            const firstHalf = nameWithoutExt.slice(0, halfLength);
            const secondHalf = nameWithoutExt.slice(-halfLength);
            return firstHalf + truncateIndicator + secondHalf + extension;
        default:
            return fileName;
    }
}

export function getFileNameParts(fileName: string): { name: string; extension: string } {
    const parts = fileName.split(".");
    if (parts.length === 1) {
        return { name: fileName, extension: "" };
    }
    const extension = parts.pop() || "";
    const name = parts.join(".");
    return { name, extension };
}
