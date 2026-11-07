const {gunzipSync}=require('node:zlib');const fs=require('node:fs'),path=require('node:path');
const expires=1794666002064,allowed="/review/OekybkCFc0PLT9ZC6s0Csgra9H1m_VkD";
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
};