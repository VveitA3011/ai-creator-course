const {chromium}=require('playwright');
const fs=require('fs');
const [,,outDir,...ids]=process.argv;
(async()=>{
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1600,height:900},deviceScaleFactor:1});
 const errs=[];p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 fs.mkdirSync(outDir,{recursive:true});
 for(const id of ids){
  const [mod,slug]=id.split('/');
  errs.length=0;
  await p.goto('http://localhost:8765/index.html?id='+slug);
  try{await p.waitForFunction(()=>document.title==='DONE'||document.title.startsWith('ERR'),null,{timeout:120000});}catch(e){console.log('TIMEOUT',id);continue;}
  const t=await p.title();
  if(t!=='DONE'){console.log('FAIL',id,t,errs.join(' | '));continue;}
  fs.mkdirSync(outDir+'/'+mod,{recursive:true});
  await p.locator('#stage').screenshot({path:`${outDir}/${mod}/${slug}.jpg`,type:'jpeg',quality:82});
  console.log('ok',id, errs.length?errs[0].slice(0,120):'');
 }
 await b.close();
})();
