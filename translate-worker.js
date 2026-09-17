const ORIGINS=new Set(['https://gucciboy.com','https://website-starter-5u7.pages.dev']);
const LANGUAGES=new Set(['zh-CN','th','en']);
// Best-effort per-isolate throttling; Google project quotas remain the spending control.
const requestWindows=new Map();
export default {async fetch(request,env){
 if(new URL(request.url).pathname!='/api/translate')return env.ASSETS.fetch(request);
 const origin=request.headers.get('Origin');
 const headers={'Content-Type':'application/json;charset=UTF-8','Cache-Control':'no-store','Vary':'Origin'};
 const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
 if(!ORIGINS.has(origin))return reply({error:'不支持的请求来源'},403);
 headers['Access-Control-Allow-Origin']=origin;headers['Access-Control-Allow-Methods']='POST, OPTIONS';headers['Access-Control-Allow-Headers']='Content-Type';
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(request.method!=='POST')return reply({error:'仅支持文字翻译'},405);
 if(!request.headers.get('Content-Type')?.includes('application/json'))return reply({error:'请求格式错误'},415);
 const raw=await request.text();if(raw.length>16000)return reply({error:'文字过长'},413);
 let data;try{data=JSON.parse(raw)}catch{return reply({error:'请求格式错误'},400)}
 if(!data||typeof data!=='object')return reply({error:'请求格式错误'},400);
 const {text,source,target}=data;
 if(typeof text!=='string'||!text.trim()||Array.from(text).length>1000||!LANGUAGES.has(target)||!(LANGUAGES.has(source)||source==='auto'))return reply({error:'请输入 1–1000 字，并选择支持的语言'},400);
 if(source===target)return reply({text});
 const now=Date.now(),ip=request.headers.get('CF-Connecting-IP')||'unknown';
 for(const [k,v] of requestWindows)if(now-v.start>60000)requestWindows.delete(k);
 const window=requestWindows.get(ip)||{start:now,count:0};
 if(window.count>=12)return reply({error:'翻译过于频繁，请稍后再试'},429);
 window.count++;requestWindows.set(ip,window);
 if(!env.GOOGLE_TRANSLATE_API_KEY)return reply({error:'翻译服务尚未启用，可先打开 Google 翻译'},503);
 try{
  const response=await fetch('https://translation.googleapis.com/language/translate/v2',{method:'POST',headers:{'Content-Type':'application/json','X-Goog-Api-Key':env.GOOGLE_TRANSLATE_API_KEY},body:JSON.stringify({q:text,target,format:'text',...(source==='auto'?{}:{source})}),signal:AbortSignal.timeout(12000)});
  if(!response.ok)return reply({error:response.status===429?'翻译额度暂时用完，请使用 Google 翻译入口':'翻译服务暂不可用，请稍后重试'},response.status===429?429:502);
  const body=await response.json(),result=body.data?.translations?.[0];
  if(typeof result?.translatedText!=='string')throw Error('Invalid translation');
  return reply({text:result.translatedText,detectedSourceLanguage:result.detectedSourceLanguage});
 }catch{return reply({error:'翻译连接失败，请使用 Google 翻译入口'},502)}
}};
