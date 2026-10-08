"use client";
import {useEffect,useRef,useState} from "react";
type Props={file:File;onCancel:()=>void;onDone:(file:File)=>void};
export default function SquareImageCropper({file,onCancel,onDone}:Props){
 const [url,setUrl]=useState("");const [size,setSize]=useState({w:1,h:1});const [zoom,setZoom]=useState(1);const [offset,setOffset]=useState({x:0,y:0});const [working,setWorking]=useState(false);
 const img=useRef<HTMLImageElement>(null);const drag=useRef<{x:number;y:number;ox:number;oy:number}|null>(null);
 useEffect(()=>{const u=URL.createObjectURL(file);setUrl(u);return()=>URL.revokeObjectURL(u)},[file]);
 const base=320/Math.min(size.w,size.h);const scale=base*zoom;
 const width=size.w*scale,height=size.h*scale;const maxX=Math.max(0,(width-320)/2),maxY=Math.max(0,(height-320)/2);
 const x=Math.max(-maxX,Math.min(maxX,offset.x)),y=Math.max(-maxY,Math.min(maxY,offset.y));
 async function crop(){if(!img.current)return;setWorking(true);try{
 const canvas=document.createElement("canvas");canvas.width=1080;canvas.height=1080;
 const ctx=canvas.getContext("2d");if(!ctx)throw new Error("Canvas unavailable");
 ctx.fillStyle="#ffffff";ctx.fillRect(0,0,1080,1080);
 const factor=1080/320;
 ctx.drawImage(img.current,(320-width)/2*factor+x*factor,(320-height)/2*factor+y*factor,width*factor,height*factor);
 const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error("Crop failed")),"image/jpeg",0.9));
 onDone(new File([blob],"snookeria-cover-"+Date.now()+".jpg",{type:"image/jpeg"}));
 }catch{setWorking(false)}}
 return <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-3" dir="rtl"><div className="w-full max-w-md rounded-2xl bg-[#142033] p-4 text-white"><h2 className="mb-2 text-center text-lg font-bold">برش تصویر پست (۱:۱)</h2><p className="mb-4 text-center text-xs text-white/60">عکس را با انگشت جابه‌جا کن و با نوار زیر آن بزرگ‌نمایی را تنظیم کن.</p>
 <div className="relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-xl bg-black touch-none" style={{width:"min(320px, 100%)"}} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);drag.current={x:e.clientX,y:e.clientY,ox:x,oy:y}}} onPointerMove={e=>{if(!drag.current)return;const ratio=320/e.currentTarget.getBoundingClientRect().width;setOffset({x:Math.max(-maxX,Math.min(maxX,drag.current.ox+(e.clientX-drag.current.x)*ratio)),y:Math.max(-maxY,Math.min(maxY,drag.current.oy+(e.clientY-drag.current.y)*ratio))})}} onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null}>
 {url&&<img ref={img} src={url} alt="تصویر انتخابی" onLoad={e=>setSize({w:e.currentTarget.naturalWidth,h:e.currentTarget.naturalHeight})} draggable={false} className="pointer-events-none absolute max-w-none select-none" style={{width:(width/320*100)+"%",height:(height/320*100)+"%",left:((320-width)/2+x)/320*100+"%",top:((320-height)/2+y)/320*100+"%"}}/>}
 <div className="pointer-events-none absolute inset-0 border border-white/60"/><div className="pointer-events-none absolute inset-[33.33%] border border-white/30"/>
 </div>
 <label className="mt-5 block text-xs text-white/70">بزرگ‌نمایی: {zoom.toFixed(1)}×<input type="range" min="1" max="3" step="0.05" value={zoom} onChange={e=>{setZoom(Number(e.target.value));setOffset({x:0,y:0})}} className="mt-3 w-full accent-red-500"/></label>
 <div className="mt-5 flex gap-3"><button type="button" disabled={working} onClick={()=>void crop()} className="flex-1 rounded-xl bg-red-600 p-3 text-sm font-bold">{working?"در حال آماده‌سازی...":"تأیید برش و آپلود"}</button><button type="button" onClick={onCancel} className="rounded-xl bg-white/10 px-5 text-sm">انصراف</button></div></div></div>
}