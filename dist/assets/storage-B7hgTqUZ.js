const i={id:"default",name:"Default Template",pattern:"{originalName}_{date}",fileTypes:[],enabled:!0},n={templates:[i],truncateOptions:{enabled:!1,maxLength:50,truncatePosition:"middle",truncateIndicator:"..."},defaultTemplate:i.id,enableLogging:!1},o={async getSettings(){return(await chrome.storage.sync.get("settings")).settings??n},async saveSettings(e){await chrome.storage.sync.set({settings:e})},async getTemplate(e){return(await this.getSettings()).templates.find(s=>s.id===e)},async addTemplate(e){const t=await this.getSettings(),s={...e,id:crypto.randomUUID()};t.templates.push(s),await this.saveSettings(t)},async updateTemplate(e){const t=await this.getSettings(),s=t.templates.findIndex(a=>a.id===e.id);s!==-1&&(t.templates[s]=e,await this.saveSettings(t))},async deleteTemplate(e){var s;const t=await this.getSettings();t.templates=t.templates.filter(a=>a.id!==e),t.defaultTemplate===e&&(t.defaultTemplate=((s=t.templates[0])==null?void 0:s.id)??""),await this.saveSettings(t)},async addToHistory(e){const t=await this.getHistory(),s={...e,id:crypto.randomUUID()};t.unshift(s),t.length>100&&t.pop(),await chrome.storage.local.set({history:t})},async getHistory(){return(await chrome.storage.local.get("history")).history??[]},async clearHistory(){await chrome.storage.local.set({history:[]})},async updateSettings(e){const t=await this.getSettings();await this.saveSettings({...t,...e})}};export{o as s};