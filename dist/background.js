import{s as d}from"./assets/storage-B7hgTqUZ.js";function T(n){return n.replace(/[<>:"/\\|?*]/g,"_")}function b(n,e){if(!e.enabled||n.length<=e.maxLength)return n;const{maxLength:t,truncatePosition:a,truncateIndicator:s}=e,r=n.includes(".")?"."+n.split(".").pop():"",i=n.slice(0,n.length-r.length);if(i.length<=t)return n;const c=s.length,o=t-c;switch(a){case"start":return s+i.slice(-o)+r;case"end":return i.slice(0,o)+s+r;case"middle":const u=Math.floor(o/2),g=i.slice(0,u),l=i.slice(-u);return g+s+l+r;default:return n}}function L(n){const e=n.split(".");if(e.length===1)return{name:n,extension:""};const t=e.pop()||"";return{name:e.join("."),extension:t}}function x(n,e){if(!(!n||!Array.isArray(n)||n.length===0))return n.find(t=>!t||typeof t.enabled!="boolean"||!t.enabled||!Array.isArray(t.fileTypes)?!1:t.fileTypes.length===0||t.fileTypes.includes(e.toLowerCase()))}function S(n){try{return!n||n===""?"unknown":n.startsWith("data:")||n.startsWith("blob:")||n.startsWith("file:")?"local":new URL(n).hostname.replace(/^www\./,"").replace(/[<>:"/\\|?*]/g,"_").toLowerCase()||"unknown"}catch{return"unknown"}}chrome.downloads.onDeterminingFilename.addListener((n,e)=>(d.getSettings().then(t=>{try{const{templates:a,truncateOptions:s}=t,r=n.filename.split(/[/\\]/).pop()||"",{name:i,extension:c}=L(r),o=x(a,c);if(!o){e();return}const u=b(i,s),g=S(n.referrer||n.url||""),l=new Date,m={originalName:u,date:l.toISOString().split("T")[0],time:l.toTimeString().split(" ")[0].replace(/:/g,"-"),timestamp:Math.floor(l.getTime()/1e3).toString(),random:Math.random().toString(36).substring(2,8),domain:g},f=o.pattern.replace(/{(\w+)}/g,(w,y)=>m[y]||w),h=T(c?`${f}.${c}`:f);e({filename:h});const p={id:n.id.toString(),originalName:r,newName:h,templateId:o.id,timestamp:l.getTime(),fileType:c.toLowerCase()};d.addToHistory(p).catch(console.error)}catch(a){console.error("Error processing download:",a),e()}}).catch(t=>{console.error("Error getting settings:",t),e()}),!0));
