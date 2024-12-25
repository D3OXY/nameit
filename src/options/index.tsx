"use client";

import * as React from "react";
import { createRoot } from "react-dom/client";
import { storage } from "@/utils/storage";
import type { FileTemplate, RenameHistory, Settings, FileType } from "@/types";
import { FileTypes } from "@/types";
import "@/styles/index.css";

const AVAILABLE_PLACEHOLDERS = [
    { key: "originalName", description: "Original filename without extension" },
    { key: "extension", description: "File extension" },
    { key: "date", description: "Current date (YYYY-MM-DD)" },
    { key: "time", description: "Current time (HH-MM-SS)" },
    { key: "datetime", description: "Full date and time (YYYY-MM-DD-HH-MM-SS)" },
    { key: "month", description: "Current month name" },
    { key: "year", description: "Current year" },
    { key: "timestamp", description: "Unix timestamp" },
    { key: "random", description: "Random 6-character string" },
    { key: "domain", description: "Source website domain" },
    { key: "fileType", description: "Type of file (document, image, video, etc.)" },
];

const FILE_TYPE_GROUPS = [
    {
        name: "Documents",
        types: [FileTypes.DOCUMENT, FileTypes.PDF, FileTypes.WORD, FileTypes.EXCEL, FileTypes.POWERPOINT, FileTypes.TEXT],
    },
    {
        name: "Images",
        types: [FileTypes.IMAGE, FileTypes.JPEG, FileTypes.PNG, FileTypes.GIF, FileTypes.SVG, FileTypes.WEBP],
    },
    {
        name: "Media",
        types: [FileTypes.AUDIO, FileTypes.VIDEO, FileTypes.MP3, FileTypes.MP4, FileTypes.WAV],
    },
    {
        name: "Archives",
        types: [FileTypes.ARCHIVE, FileTypes.ZIP, FileTypes.RAR, FileTypes["7Z"], FileTypes.TAR],
    },
    {
        name: "Code",
        types: [FileTypes.CODE, FileTypes.HTML, FileTypes.CSS, FileTypes.JAVASCRIPT, FileTypes.TYPESCRIPT, FileTypes.PYTHON, FileTypes.JAVA],
    },
    {
        name: "Other",
        types: [FileTypes.OTHER],
    },
];

interface TemplateFormData {
    name: string;
    pattern: string;
    fileTypes: FileType[];
    enabled: boolean;
}

const Options: React.FC = () => {
    const [settings, setSettings] = React.useState<Settings | null>(null);
    const [history, setHistory] = React.useState<RenameHistory[]>([]);
    const [showForm, setShowForm] = React.useState(false);
    const [editingTemplate, setEditingTemplate] = React.useState<FileTemplate | null>(null);
    const [formData, setFormData] = React.useState<TemplateFormData>({
        name: "",
        pattern: "",
        fileTypes: [],
        enabled: true,
    });
    const [truncateOptions, setTruncateOptions] = React.useState<Settings["truncateOptions"]>({
        enabled: false,
        maxLength: 50,
        truncatePosition: "middle",
        truncateIndicator: "...",
    });

    React.useEffect(() => {
        Promise.all([storage.getSettings(), storage.getHistory()]).then(([settings, history]) => {
            setSettings(settings);
            setHistory(history);
            setTruncateOptions(settings.truncateOptions);
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;

        if (editingTemplate) {
            await storage.updateTemplate({
                ...editingTemplate,
                ...formData,
            });
        } else {
            await storage.addTemplate(formData);
        }

        const newSettings = await storage.getSettings();
        setSettings(newSettings);
        setShowForm(false);
        resetForm();
    };

    const handleEdit = (template: FileTemplate) => {
        setEditingTemplate(template);
        setFormData({
            name: template.name,
            pattern: template.pattern,
            fileTypes: template.fileTypes as FileType[],
            enabled: template.enabled,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        await storage.deleteTemplate(id);
        const newSettings = await storage.getSettings();
        setSettings(newSettings);
    };

    const resetForm = () => {
        setEditingTemplate(null);
        setFormData({
            name: "",
            pattern: "",
            fileTypes: [],
            enabled: true,
        });
    };

    const clearHistory = async () => {
        await storage.clearHistory();
        setHistory([]);
    };

    const isGroupSelected = (groupTypes: FileType[]) => {
        return groupTypes.every((type) => formData.fileTypes.includes(type));
    };

    const isGroupPartiallySelected = (groupTypes: FileType[]) => {
        return groupTypes.some((type) => formData.fileTypes.includes(type)) && !isGroupSelected(groupTypes);
    };

    const toggleGroup = (groupTypes: FileType[], checked: boolean) => {
        const newTypes = checked ? [...new Set([...formData.fileTypes, ...groupTypes])] : formData.fileTypes.filter((t) => !groupTypes.includes(t));
        setFormData({ ...formData, fileTypes: newTypes });
    };

    const handleExportTemplates = () => {
        if (!settings) return;

        const exportData = {
            templates: settings.templates,
            truncateOptions: settings.truncateOptions,
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `nameit-settings-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportTemplates = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !settings) return;

        try {
            const text = await file.text();
            const importedData = JSON.parse(text);

            // Validate imported data
            if (!importedData || typeof importedData !== "object") {
                throw new Error("Invalid file format");
            }

            const { templates, truncateOptions } = importedData;

            // Validate templates
            if (!Array.isArray(templates)) {
                throw new Error("Invalid templates format");
            }

            // Generate new IDs for imported templates to avoid conflicts
            const importedTemplates = templates.map((template) => ({
                ...template,
                id: crypto.randomUUID(),
            }));

            // Validate truncateOptions
            if (truncateOptions && typeof truncateOptions === "object") {
                const validPositions = ["start", "middle", "end"];
                if (
                    typeof truncateOptions.enabled !== "boolean" ||
                    typeof truncateOptions.maxLength !== "number" ||
                    !validPositions.includes(truncateOptions.truncatePosition) ||
                    typeof truncateOptions.truncateIndicator !== "string"
                ) {
                    throw new Error("Invalid truncate options format");
                }
            }

            // Update settings with imported data
            const newSettings = {
                ...settings,
                templates: [...settings.templates, ...importedTemplates],
                truncateOptions: truncateOptions || settings.truncateOptions,
            };

            await storage.saveSettings(newSettings);
            setSettings(newSettings);
            setTruncateOptions(newSettings.truncateOptions);

            // Reset file input
            e.target.value = "";
        } catch (error) {
            alert("Error importing settings: " + (error instanceof Error ? error.message : "Invalid file format"));
        }
    };

    const handleTruncateOptionsChange = async (updates: Partial<Settings["truncateOptions"]>) => {
        const newOptions = { ...truncateOptions, ...updates };
        setTruncateOptions(newOptions);
        await storage.updateSettings({ truncateOptions: newOptions });
    };

    if (!settings) {
        return <div className="container">Loading...</div>;
    }

    return (
        <div className="container">
            <h1>NameIt Settings</h1>

            <div className="flex justify-between items-center">
                <h2>Templates</h2>
                <div className="template-actions">
                    {!showForm && (
                        <button className="button" onClick={() => setShowForm(true)}>
                            Add Template
                        </button>
                    )}
                    <button className="button button-secondary" onClick={handleExportTemplates}>
                        Export Templates
                    </button>
                    <label className="button button-secondary">
                        Import Templates
                        <input type="file" accept=".json" onChange={handleImportTemplates} style={{ display: "none" }} />
                    </label>
                </div>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="template-item mb-4">
                    <div className="form-group">
                        <label className="form-label">Template Name</label>
                        <input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Pattern</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.pattern}
                            onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                            required
                            placeholder="e.g., {originalName}_{date}"
                        />
                        <div className="mt-4">
                            <p className="mb-2">Available Placeholders:</p>
                            {AVAILABLE_PLACEHOLDERS.map((placeholder) => (
                                <div key={placeholder.key} className="text-sm mb-2">
                                    <code>{`{${placeholder.key}}`}</code> - {placeholder.description}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">File Types (optional)</label>
                        <div className="file-type-groups">
                            {FILE_TYPE_GROUPS.map((group) => (
                                <div key={group.name} className="file-type-group">
                                    <div className="file-type-group-header">
                                        <h4 className="file-type-group-title">{group.name}</h4>
                                        <label className="checkbox-group select-all">
                                            <input
                                                type="checkbox"
                                                checked={isGroupSelected(group.types)}
                                                ref={(el) => {
                                                    if (el) {
                                                        el.indeterminate = isGroupPartiallySelected(group.types);
                                                    }
                                                }}
                                                onChange={(e) => toggleGroup(group.types, e.target.checked)}
                                            />
                                            Select All
                                        </label>
                                    </div>
                                    <div className="file-type-options">
                                        {group.types.map((type) => (
                                            <label key={type} className="checkbox-group">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.fileTypes.includes(type)}
                                                    onChange={(e) => {
                                                        const newTypes = e.target.checked ? [...formData.fileTypes, type] : formData.fileTypes.filter((t) => t !== type);
                                                        setFormData({ ...formData, fileTypes: newTypes });
                                                    }}
                                                />
                                                {type}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="checkbox-group">
                        <input type="checkbox" id="enabled" checked={formData.enabled} onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })} />
                        <label htmlFor="enabled">Enabled</label>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button type="submit" className="button">
                            {editingTemplate ? "Update" : "Create"} Template
                        </button>
                        <button
                            type="button"
                            className="button button-secondary"
                            onClick={() => {
                                setShowForm(false);
                                resetForm();
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="template-list">
                {settings.templates.map((template) => (
                    <div key={template.id} className="template-item">
                        <div className="template-header">
                            <div className="template-info">
                                <div className="template-title">
                                    <h3>{template.name}</h3>
                                    <span className={`template-status ${template.enabled ? "status-enabled" : "status-disabled"}`}>
                                        {template.enabled ? "Enabled" : "Disabled"}
                                    </span>
                                </div>
                                <div className="template-pattern">
                                    <span className="pattern-label">Pattern:</span>
                                    <code>{template.pattern}</code>
                                </div>
                                {template.fileTypes.length > 0 && (
                                    <div className="template-types">
                                        <span className="types-label">File Types:</span>
                                        <div className="type-tags">
                                            {template.fileTypes.map((type) => (
                                                <span key={type} className="type-tag">
                                                    {type}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="template-example">
                                    <span className="example-label">Example:</span>
                                    <code className="example-text">
                                        document
                                        {template.pattern
                                            .replace("{originalName}", "example")
                                            .replace("{date}", "2024-01-19")
                                            .replace("{time}", "14-30-00")
                                            .replace("{extension}", ".pdf")
                                            .replace("{domain}", "example.com")
                                            .replace("{fileType}", "document")}
                                    </code>
                                </div>
                            </div>
                            <div className="template-actions">
                                <button className="button button-secondary" onClick={() => handleEdit(template)}>
                                    Edit
                                </button>
                                <button className="button button-secondary" onClick={() => handleDelete(template.id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <h2>History</h2>
            {history.length > 0 ? (
                <>
                    <div className="history-list">
                        {history.map((item) => (
                            <div key={item.id} className="history-item">
                                <div>
                                    Original: <strong>{item.originalName}</strong>
                                </div>
                                <div>
                                    New: <strong>{item.newName}</strong>
                                </div>
                                <div className="history-item-time">{new Date(item.timestamp).toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                    <button className="button button-secondary" onClick={clearHistory}>
                        Clear History
                    </button>
                </>
            ) : (
                <p>No rename history yet.</p>
            )}

            <section className="form-section">
                <h2>File Name Truncation</h2>
                <p className="text-sm mb-4">Configure how long file names should be handled when used in patterns</p>

                <div className="form-group">
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="enableTruncation"
                            checked={truncateOptions.enabled}
                            onChange={(e) => handleTruncateOptionsChange({ enabled: e.target.checked })}
                        />
                        <label htmlFor="enableTruncation">Enable file name truncation</label>
                    </div>
                </div>

                {truncateOptions.enabled && (
                    <>
                        <div className="form-group">
                            <label className="form-label" htmlFor="maxLength">
                                Maximum Length
                            </label>
                            <input
                                type="number"
                                id="maxLength"
                                className="form-input"
                                value={truncateOptions.maxLength}
                                min={10}
                                max={200}
                                onChange={(e) => handleTruncateOptionsChange({ maxLength: parseInt(e.target.value, 10) })}
                            />
                            <p className="text-sm">Maximum number of characters before truncation (excluding extension)</p>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="truncatePosition">
                                Truncate Position
                            </label>
                            <select
                                id="truncatePosition"
                                className="form-input"
                                value={truncateOptions.truncatePosition}
                                onChange={(e) => handleTruncateOptionsChange({ truncatePosition: e.target.value as Settings["truncateOptions"]["truncatePosition"] })}
                            >
                                <option value="start">Start</option>
                                <option value="middle">Middle</option>
                                <option value="end">End</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="truncateIndicator">
                                Truncation Indicator
                            </label>
                            <input
                                type="text"
                                id="truncateIndicator"
                                className="form-input"
                                value={truncateOptions.truncateIndicator}
                                maxLength={5}
                                onChange={(e) => handleTruncateOptionsChange({ truncateIndicator: e.target.value })}
                            />
                            <p className="text-sm">Characters to show truncation (e.g., "...")</p>
                        </div>
                    </>
                )}
            </section>

            <div className="footer">
                Made with 💙 By{" "}
                <a href="https://deoxy.dev" target="_blank" rel="noopener noreferrer">
                    DEOXY
                </a>
            </div>
        </div>
    );
};

const root = createRoot(document.getElementById("root")!);
root.render(<Options />);
