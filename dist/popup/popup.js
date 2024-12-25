import{c as p,j as e,r as a}from"../assets/index-Ht91wEZH.js";import{s as n}from"../assets/storage-B7hgTqUZ.js";const x=()=>{const[i,l]=a.useState([]),[r,o]=a.useState([]),[d,m]=a.useState(!0);a.useEffect(()=>{Promise.all([n.getSettings(),n.getHistory()]).then(([s,t])=>{l(s.templates),o(t),m(!1)})},[]);const h=async s=>{const t={...s,enabled:!s.enabled};await n.updateTemplate(t),l(i.map(c=>c.id===s.id?t:c))};return e.jsxs("div",{className:"popup-container",children:[e.jsxs("div",{className:"popup-header",children:[e.jsx("h1",{children:"NameIt"}),e.jsx("button",{className:"button button-sm",onClick:()=>chrome.runtime.openOptionsPage(),children:"Settings"})]}),d?e.jsx("p",{children:"Loading..."}):i.length===0?e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("p",{children:"No templates configured yet."}),e.jsx("button",{className:"button",onClick:()=>chrome.runtime.openOptionsPage(),children:"Add Template"})]}):e.jsxs("div",{className:"popup-content",children:[e.jsx("div",{className:"template-list-compact",children:i.map(s=>e.jsxs("div",{className:"template-item-compact",children:[e.jsxs("div",{className:"template-item-header",children:[e.jsxs("div",{className:"checkbox-group",children:[e.jsx("input",{type:"checkbox",id:s.id,checked:s.enabled,onChange:()=>h(s)}),e.jsx("label",{htmlFor:s.id,children:s.name})]}),e.jsx("span",{className:`status-dot ${s.enabled?"status-enabled":"status-disabled"}`})]}),e.jsx("div",{className:"template-pattern-compact",children:s.pattern})]},s.id))}),r.length>0&&e.jsxs("div",{className:"history-list",children:[e.jsx("h3",{children:"Recent Renames"}),r.map(s=>e.jsxs("div",{className:"history-item",children:[e.jsxs("div",{className:"history-item-row",children:[e.jsx("span",{className:"history-item-label",children:"Original:"}),e.jsx("span",{className:"history-item-value",children:e.jsx("strong",{children:s.originalName})})]}),e.jsxs("div",{className:"history-item-row",children:[e.jsx("span",{className:"history-item-label",children:"New:"}),e.jsx("span",{className:"history-item-value",children:e.jsx("strong",{children:s.newName})})]}),e.jsx("div",{className:"history-item-time",children:new Date(s.timestamp).toLocaleString()})]},s.id))]})]}),e.jsxs("div",{className:"footer",children:["Made with 💙 By"," ",e.jsx("a",{href:"https://deoxy.dev",target:"_blank",rel:"noopener noreferrer",children:"DEOXY"})]})]})},j=p(document.getElementById("root"));j.render(e.jsx(x,{}));
