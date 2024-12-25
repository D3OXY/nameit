import { Settings, FileTemplate, RenameHistory } from "@/types";

const DEFAULT_TEMPLATE: FileTemplate = {
    id: "default",
    name: "Default Template",
    pattern: "{originalName}_{date}",
    fileTypes: [],
    enabled: true,
};

const DEFAULT_SETTINGS: Settings = {
    templates: [DEFAULT_TEMPLATE],
    truncateOptions: {
        enabled: false,
        maxLength: 50,
        truncatePosition: "middle",
        truncateIndicator: "...",
    },
    defaultTemplate: DEFAULT_TEMPLATE.id,
    enableLogging: false,
};

export const storage = {
    async getSettings(): Promise<Settings> {
        const result = await chrome.storage.sync.get("settings");
        return result.settings ?? DEFAULT_SETTINGS;
    },

    async saveSettings(settings: Settings): Promise<void> {
        await chrome.storage.sync.set({ settings });
    },

    async getTemplate(id: string): Promise<FileTemplate | undefined> {
        const settings = await this.getSettings();
        return settings.templates.find((t) => t.id === id);
    },

    async addTemplate(template: Omit<FileTemplate, "id">): Promise<void> {
        const settings = await this.getSettings();
        const newTemplate: FileTemplate = {
            ...template,
            id: crypto.randomUUID(),
        };
        settings.templates.push(newTemplate);
        await this.saveSettings(settings);
    },

    async updateTemplate(template: FileTemplate): Promise<void> {
        const settings = await this.getSettings();
        const index = settings.templates.findIndex((t) => t.id === template.id);
        if (index !== -1) {
            settings.templates[index] = template;
            await this.saveSettings(settings);
        }
    },

    async deleteTemplate(id: string): Promise<void> {
        const settings = await this.getSettings();
        settings.templates = settings.templates.filter((t) => t.id !== id);
        if (settings.defaultTemplate === id) {
            settings.defaultTemplate = settings.templates[0]?.id ?? "";
        }
        await this.saveSettings(settings);
    },

    async addToHistory(entry: Omit<RenameHistory, "id">): Promise<void> {
        const history = await this.getHistory();
        const newEntry: RenameHistory = {
            ...entry,
            id: crypto.randomUUID(),
        };
        history.unshift(newEntry);
        // Keep only last 100 entries
        if (history.length > 100) {
            history.pop();
        }
        await chrome.storage.local.set({ history });
    },

    async getHistory(): Promise<RenameHistory[]> {
        const result = await chrome.storage.local.get("history");
        return result.history ?? [];
    },

    async clearHistory(): Promise<void> {
        await chrome.storage.local.set({ history: [] });
    },

    async updateSettings(updates: Partial<Settings>): Promise<void> {
        const settings = await this.getSettings();
        await this.saveSettings({ ...settings, ...updates });
    },
};
