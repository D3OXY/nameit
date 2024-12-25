import{c as F,j as e,r as m}from"../assets/index-Ht91wEZH.js";import{s as r}from"../assets/storage-B7hgTqUZ.js";const a={DOCUMENT:"document",PDF:"pdf",WORD:"word",EXCEL:"excel",POWERPOINT:"powerpoint",TEXT:"text",IMAGE:"image",JPEG:"jpeg",PNG:"png",GIF:"gif",SVG:"svg",WEBP:"webp",AUDIO:"audio",VIDEO:"video",MP3:"mp3",MP4:"mp4",WAV:"wav",ARCHIVE:"archive",ZIP:"zip",RAR:"rar","7Z":"7z",TAR:"tar",CODE:"code",HTML:"html",CSS:"css",JAVASCRIPT:"javascript",TYPESCRIPT:"typescript",PYTHON:"python",JAVA:"java",OTHER:"other"},H=[{key:"originalName",description:"Original filename without extension"},{key:"extension",description:"File extension"},{key:"date",description:"Current date (YYYY-MM-DD)"},{key:"time",description:"Current time (HH-MM-SS)"},{key:"datetime",description:"Full date and time (YYYY-MM-DD-HH-MM-SS)"},{key:"month",description:"Current month name"},{key:"year",description:"Current year"},{key:"timestamp",description:"Unix timestamp"},{key:"random",description:"Random 6-character string"},{key:"domain",description:"Source website domain"},{key:"fileType",description:"Type of file (document, image, video, etc.)"}],G=[{name:"Documents",types:[a.DOCUMENT,a.PDF,a.WORD,a.EXCEL,a.POWERPOINT,a.TEXT]},{name:"Images",types:[a.IMAGE,a.JPEG,a.PNG,a.GIF,a.SVG,a.WEBP]},{name:"Media",types:[a.AUDIO,a.VIDEO,a.MP3,a.MP4,a.WAV]},{name:"Archives",types:[a.ARCHIVE,a.ZIP,a.RAR,a["7Z"],a.TAR]},{name:"Code",types:[a.CODE,a.HTML,a.CSS,a.JAVASCRIPT,a.TYPESCRIPT,a.PYTHON,a.JAVA]},{name:"Other",types:[a.OTHER]}],Y=()=>{const[l,u]=m.useState(null),[N,v]=m.useState([]),[T,x]=m.useState(!1),[y,E]=m.useState(null),[n,o]=m.useState({name:"",pattern:"",fileTypes:[],enabled:!0}),[p,b]=m.useState({enabled:!1,maxLength:50,truncatePosition:"middle",truncateIndicator:"..."});m.useEffect(()=>{Promise.all([r.getSettings(),r.getHistory()]).then(([t,s])=>{u(t),v(s),b(t.truncateOptions)})},[]);const P=async t=>{if(t.preventDefault(),!l)return;y?await r.updateTemplate({...y,...n}):await r.addTemplate(n);const s=await r.getSettings();u(s),x(!1),S()},w=t=>{E(t),o({name:t.name,pattern:t.pattern,fileTypes:t.fileTypes,enabled:t.enabled}),x(!0)},I=async t=>{await r.deleteTemplate(t);const s=await r.getSettings();u(s)},S=()=>{E(null),o({name:"",pattern:"",fileTypes:[],enabled:!0})},k=async()=>{await r.clearHistory(),v([])},C=t=>t.every(s=>n.fileTypes.includes(s)),A=t=>t.some(s=>n.fileTypes.includes(s))&&!C(t),D=(t,s)=>{const c=s?[...new Set([...n.fileTypes,...t])]:n.fileTypes.filter(i=>!t.includes(i));o({...n,fileTypes:c})},R=()=>{if(!l)return;const t={templates:l.templates,truncateOptions:l.truncateOptions},s=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),c=URL.createObjectURL(s),i=document.createElement("a");i.href=c,i.download=`nameit-settings-${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(c)},L=async t=>{var c;const s=(c=t.target.files)==null?void 0:c[0];if(!(!s||!l))try{const i=await s.text(),h=JSON.parse(i);if(!h||typeof h!="object")throw new Error("Invalid file format");const{templates:O,truncateOptions:d}=h;if(!Array.isArray(O))throw new Error("Invalid templates format");const M=O.map(g=>({...g,id:crypto.randomUUID()}));if(d&&typeof d=="object"){const g=["start","middle","end"];if(typeof d.enabled!="boolean"||typeof d.maxLength!="number"||!g.includes(d.truncatePosition)||typeof d.truncateIndicator!="string")throw new Error("Invalid truncate options format")}const f={...l,templates:[...l.templates,...M],truncateOptions:d||l.truncateOptions};await r.saveSettings(f),u(f),b(f.truncateOptions),t.target.value=""}catch(i){alert("Error importing settings: "+(i instanceof Error?i.message:"Invalid file format"))}},j=async t=>{const s={...p,...t};b(s),await r.updateSettings({truncateOptions:s})};return l?e.jsxs("div",{className:"container",children:[e.jsx("h1",{children:"NameIt Settings"}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("h2",{children:"Templates"}),e.jsxs("div",{className:"template-actions",children:[!T&&e.jsx("button",{className:"button",onClick:()=>x(!0),children:"Add Template"}),e.jsx("button",{className:"button button-secondary",onClick:R,children:"Export Templates"}),e.jsxs("label",{className:"button button-secondary",children:["Import Templates",e.jsx("input",{type:"file",accept:".json",onChange:L,style:{display:"none"}})]})]})]}),T&&e.jsxs("form",{onSubmit:P,className:"template-item mb-4",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"Template Name"}),e.jsx("input",{type:"text",className:"form-input",value:n.name,onChange:t=>o({...n,name:t.target.value}),required:!0})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"Pattern"}),e.jsx("input",{type:"text",className:"form-input",value:n.pattern,onChange:t=>o({...n,pattern:t.target.value}),required:!0,placeholder:"e.g., {originalName}_{date}"}),e.jsxs("div",{className:"mt-4",children:[e.jsx("p",{className:"mb-2",children:"Available Placeholders:"}),H.map(t=>e.jsxs("div",{className:"text-sm mb-2",children:[e.jsx("code",{children:`{${t.key}}`})," - ",t.description]},t.key))]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"File Types (optional)"}),e.jsx("div",{className:"file-type-groups",children:G.map(t=>e.jsxs("div",{className:"file-type-group",children:[e.jsxs("div",{className:"file-type-group-header",children:[e.jsx("h4",{className:"file-type-group-title",children:t.name}),e.jsxs("label",{className:"checkbox-group select-all",children:[e.jsx("input",{type:"checkbox",checked:C(t.types),ref:s=>{s&&(s.indeterminate=A(t.types))},onChange:s=>D(t.types,s.target.checked)}),"Select All"]})]}),e.jsx("div",{className:"file-type-options",children:t.types.map(s=>e.jsxs("label",{className:"checkbox-group",children:[e.jsx("input",{type:"checkbox",checked:n.fileTypes.includes(s),onChange:c=>{const i=c.target.checked?[...n.fileTypes,s]:n.fileTypes.filter(h=>h!==s);o({...n,fileTypes:i})}}),s]},s))})]},t.name))})]}),e.jsxs("div",{className:"checkbox-group",children:[e.jsx("input",{type:"checkbox",id:"enabled",checked:n.enabled,onChange:t=>o({...n,enabled:t.target.checked})}),e.jsx("label",{htmlFor:"enabled",children:"Enabled"})]}),e.jsxs("div",{className:"flex gap-2 mt-4",children:[e.jsxs("button",{type:"submit",className:"button",children:[y?"Update":"Create"," Template"]}),e.jsx("button",{type:"button",className:"button button-secondary",onClick:()=>{x(!1),S()},children:"Cancel"})]})]}),e.jsx("div",{className:"template-list",children:l.templates.map(t=>e.jsx("div",{className:"template-item",children:e.jsxs("div",{className:"template-header",children:[e.jsxs("div",{className:"template-info",children:[e.jsxs("div",{className:"template-title",children:[e.jsx("h3",{children:t.name}),e.jsx("span",{className:`template-status ${t.enabled?"status-enabled":"status-disabled"}`,children:t.enabled?"Enabled":"Disabled"})]}),e.jsxs("div",{className:"template-pattern",children:[e.jsx("span",{className:"pattern-label",children:"Pattern:"}),e.jsx("code",{children:t.pattern})]}),t.fileTypes.length>0&&e.jsxs("div",{className:"template-types",children:[e.jsx("span",{className:"types-label",children:"File Types:"}),e.jsx("div",{className:"type-tags",children:t.fileTypes.map(s=>e.jsx("span",{className:"type-tag",children:s},s))})]}),e.jsxs("div",{className:"template-example",children:[e.jsx("span",{className:"example-label",children:"Example:"}),e.jsxs("code",{className:"example-text",children:["document",t.pattern.replace("{originalName}","example").replace("{date}","2024-01-19").replace("{time}","14-30-00").replace("{extension}",".pdf").replace("{domain}","example.com").replace("{fileType}","document")]})]})]}),e.jsxs("div",{className:"template-actions",children:[e.jsx("button",{className:"button button-secondary",onClick:()=>w(t),children:"Edit"}),e.jsx("button",{className:"button button-secondary",onClick:()=>I(t.id),children:"Delete"})]})]})},t.id))}),e.jsx("h2",{children:"History"}),N.length>0?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"history-list",children:N.map(t=>e.jsxs("div",{className:"history-item",children:[e.jsxs("div",{children:["Original: ",e.jsx("strong",{children:t.originalName})]}),e.jsxs("div",{children:["New: ",e.jsx("strong",{children:t.newName})]}),e.jsx("div",{className:"history-item-time",children:new Date(t.timestamp).toLocaleString()})]},t.id))}),e.jsx("button",{className:"button button-secondary",onClick:k,children:"Clear History"})]}):e.jsx("p",{children:"No rename history yet."}),e.jsxs("section",{className:"form-section",children:[e.jsx("h2",{children:"File Name Truncation"}),e.jsx("p",{className:"text-sm mb-4",children:"Configure how long file names should be handled when used in patterns"}),e.jsx("div",{className:"form-group",children:e.jsxs("div",{className:"checkbox-group",children:[e.jsx("input",{type:"checkbox",id:"enableTruncation",checked:p.enabled,onChange:t=>j({enabled:t.target.checked})}),e.jsx("label",{htmlFor:"enableTruncation",children:"Enable file name truncation"})]})}),p.enabled&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",htmlFor:"maxLength",children:"Maximum Length"}),e.jsx("input",{type:"number",id:"maxLength",className:"form-input",value:p.maxLength,min:10,max:200,onChange:t=>j({maxLength:parseInt(t.target.value,10)})}),e.jsx("p",{className:"text-sm",children:"Maximum number of characters before truncation (excluding extension)"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",htmlFor:"truncatePosition",children:"Truncate Position"}),e.jsxs("select",{id:"truncatePosition",className:"form-input",value:p.truncatePosition,onChange:t=>j({truncatePosition:t.target.value}),children:[e.jsx("option",{value:"start",children:"Start"}),e.jsx("option",{value:"middle",children:"Middle"}),e.jsx("option",{value:"end",children:"End"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",htmlFor:"truncateIndicator",children:"Truncation Indicator"}),e.jsx("input",{type:"text",id:"truncateIndicator",className:"form-input",value:p.truncateIndicator,maxLength:5,onChange:t=>j({truncateIndicator:t.target.value})}),e.jsx("p",{className:"text-sm",children:'Characters to show truncation (e.g., "...")'})]})]})]}),e.jsxs("div",{className:"footer",children:["Made with 💙 By"," ",e.jsx("a",{href:"https://deoxy.dev",target:"_blank",rel:"noopener noreferrer",children:"DEOXY"})]})]}):e.jsx("div",{className:"container",children:"Loading..."})},U=F(document.getElementById("root"));U.render(e.jsx(Y,{}));