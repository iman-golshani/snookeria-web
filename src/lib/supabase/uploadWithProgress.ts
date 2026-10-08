import {cmsSupabase} from "@/lib/supabase/cms";

/** Browser upload with real byte progress; matches Supabase Storage standard upload endpoint. */
export async function uploadWithProgress(path:string,file:File,onProgress:(percent:number)=>void):Promise<void>{
 const base=process.env.NEXT_PUBLIC_CMS_SUPABASE_URL;
 const anon=process.env.NEXT_PUBLIC_CMS_SUPABASE_ANON_KEY;
 if(!base||!anon)throw new Error("تنظیمات اتصال CMS کامل نیست.");
 const {data:{session}}=await cmsSupabase.auth.getSession();
 const token=session?.access_token||anon;
 await new Promise<void>((resolve,reject)=>{
  const xhr=new XMLHttpRequest();
  xhr.open("POST",base.replace(/\/$/,"")+"/storage/v1/object/cms-media/"+path.split("/").map(encodeURIComponent).join("/"));
  xhr.setRequestHeader("apikey",anon);
  xhr.setRequestHeader("Authorization","Bearer "+token);
  xhr.setRequestHeader("x-upsert","false");
  xhr.setRequestHeader("Content-Type",file.type||"application/octet-stream");
  xhr.upload.onprogress=e=>{if(e.lengthComputable)onProgress(Math.min(99,Math.round(e.loaded/e.total*100)))};
  xhr.onerror=()=>reject(new Error("اتصال هنگام آپلود قطع شد."));
  xhr.onload=()=>{if(xhr.status>=200&&xhr.status<300){onProgress(100);resolve()}else{let msg=xhr.responseText;try{const body=JSON.parse(msg);msg=body.message||body.error||msg}catch{}reject(new Error(msg||"آپلود ناموفق بود"))}};
  xhr.send(file);
 });
}
