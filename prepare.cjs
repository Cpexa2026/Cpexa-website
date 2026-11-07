const fs=require('node:fs'),crypto=require('node:crypto'),zlib=require('node:zlib');
const start=Date.now(),expires=start+7*24*60*60*1000;
const token=crypto.randomBytes(24).toString('base64url');
const meta={createdAt:new Date(start).toISOString(),expiresAt:new Date(expires).toISOString(),path:'/review/'+token,projectName:'cpexa-client-review',source:'CPEXA_Interactive_Design_Preview.html'};
fs.writeFileSync('review.json',JSON.stringify(meta,null,2));
let html=fs.readFileSync('source-preview.html','utf8');
html=html.replace('</head>','<meta name="robots" content="noindex,nofollow,noarchive"><meta name="referrer" content="no-referrer"></head>');
const deadlineScript=`<script>(()=>{const end=${expires};function check(){if(Date.now()>=end){document.body.innerHTML='<main style="padding:60px;font:20px Arial;color:#002b45"><h1>This review link has expired.</h1><p>Please contact Studio Thirty Design for an updated preview.</p></main>';return;}setTimeout(check,Math.min(end-Date.now(),60000));}check();})();</script>`;
html=html.replace('</body>',deadlineScript+'</body>');
fs.writeFileSync('preview.html.gz',zlib.gzipSync(html));
const server=`const {gunzipSync}=require('node:zlib');const fs=require('node:fs'),path=require('node:path');
const expires=${expires},allowed=${JSON.stringify(meta.path)};
module.exports=(req,res)=>{
res.setHeader('Cache-Control','private, no-store, max-age=0, must-revalidate');
res.setHeader('CDN-Cache-Control','no-store');res.setHeader('Vercel-CDN-Cache-Control','no-store');
res.setHeader('X-Robots-Tag','noindex, nofollow, noarchive');
res.setHeader('Referrer-Policy','no-referrer');res.setHeader('X-Content-Type-Options','nosniff');
res.setHeader('Content-Type','text/html; charset=utf-8');
const requested=new URL(req.url,'https://preview.invalid').pathname;
if(requested!==allowed&&requested!==allowed+'/'){res.statusCode=404;return res.end('<h1>Review link required</h1>');}
if(Date.now()>=expires){res.statusCode=410;return res.end('<!doctype html><html><meta name="viewport" content="width=device-width"><body style="background:#f6f3ea;color:#002b45;font:18px Arial;padding:60px"><h1>This review link has expired.</h1><p>Please contact Studio Thirty Design for an updated preview.</p></body></html>');}
if(!['GET','HEAD'].includes(req.method)){res.statusCode=405;return res.end();}
res.statusCode=200;
if(req.method==='HEAD')return res.end();
return res.end(gunzipSync(fs.readFileSync(path.join(__dirname,'preview.html.gz'))));
};`;
fs.writeFileSync('server.cjs',server);
const build=`const fs=require('node:fs');const p='.vercel/output';const f=p+'/functions/review.func';fs.mkdirSync(f,{recursive:true});fs.copyFileSync('server.cjs',f+'/index.js');fs.copyFileSync('preview.html.gz',f+'/preview.html.gz');fs.writeFileSync(f+'/.vc-config.json',JSON.stringify({runtime:'nodejs22.x',handler:'index.js',launcherType:'Nodejs',shouldAddHelpers:true}));fs.writeFileSync(p+'/config.json',JSON.stringify({version:3,routes:[{src:'/(.*)',dest:'/review'}]}));`;
fs.writeFileSync('build.cjs',build);
fs.writeFileSync('vercel.json',JSON.stringify({buildCommand:'node build.cjs',installCommand:'',framework:null}));
fs.writeFileSync('package.json',JSON.stringify({name:'cpexa-client-review',private:true,version:'1.0.0',engines:{node:'22.x'},scripts:{start:'node dev.cjs'}}));
console.log(JSON.stringify({expiresAt:meta.expiresAt,files:6}));
