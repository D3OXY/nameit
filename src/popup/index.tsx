"use client";

import * as React from "react";
import { createRoot } from "react-dom/client";
import { storage } from "@/utils/storage";
import type { FileTemplate, RenameHistory } from "@/types";
import "@/styles/index.css";

const Popup: React.FC = () => {
    const [templates, setTemplates] = React.useState<FileTemplate[]>([]);
    const [history, setHistory] = React.useState<RenameHistory[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        Promise.all([storage.getSettings(), storage.getHistory()]).then(([settings, historyItems]) => {
            setTemplates(settings.templates);
            setHistory(historyItems);
            setLoading(false);
        });
    }, []);

    const toggleTemplate = async (template: FileTemplate) => {
        const updatedTemplate = { ...template, enabled: !template.enabled };
        await storage.updateTemplate(updatedTemplate);
        setTemplates(templates.map((t) => (t.id === template.id ? updatedTemplate : t)));
    };

    return (
        <div className="popup-container">
            <div className="popup-header">
                <h1>NameIt</h1>
                <button className="button button-sm" onClick={() => chrome.runtime.openOptionsPage()}>
                    Settings
                </button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : templates.length === 0 ? (
                <div className="flex flex-col gap-4">
                    <p>No templates configured yet.</p>
                    <button className="button" onClick={() => chrome.runtime.openOptionsPage()}>
                        Add Template
                    </button>
                </div>
            ) : (
                <div className="popup-content">
                    <div className="template-list-compact">
                        {templates.map((template) => (
                            <div key={template.id} className="template-item-compact">
                                <div className="template-item-header">
                                    <div className="checkbox-group">
                                        <input type="checkbox" id={template.id} checked={template.enabled} onChange={() => toggleTemplate(template)} />
                                        <label htmlFor={template.id}>{template.name}</label>
                                    </div>
                                    <span className={`status-dot ${template.enabled ? "status-enabled" : "status-disabled"}`} />
                                </div>
                                <div className="template-pattern-compact">{template.pattern}</div>
                            </div>
                        ))}
                    </div>

                    {history.length > 0 && (
                        <div className="history-list">
                            <h3>Recent Renames</h3>
                            {history.map((item) => (
                                <div key={item.id} className="history-item">
                                    <div className="history-item-row">
                                        <span className="history-item-label">Original:</span>
                                        <span className="history-item-value">
                                            <strong>{item.originalName}</strong>
                                        </span>
                                    </div>
                                    <div className="history-item-row">
                                        <span className="history-item-label">New:</span>
                                        <span className="history-item-value">
                                            <strong>{item.newName}</strong>
                                        </span>
                                    </div>
                                    <div className="history-item-time">{new Date(item.timestamp).toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

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
root.render(<Popup />);
