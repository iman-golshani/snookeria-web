"use client";
import {useEffect,useRef} from "react";
import {usePathname} from "next/navigation";
import {cmsSupabase} from "@/lib/supabase/cms";
export default function SiteAnalyticsTracker(){
 const pathname=usePathname();const last=useRef("");
 useEffect(()=>{
  if(pathname.startsWith("/admin")||pathname.startsWith("/api"))return;
  let id=localStorage.getItem("snookeria-analytics-id");
  if(!id){id=crypto.randomUUID();localStorage.setItem("snookeria-analytics-id",id)}
  const visitor=id;
  const device=/ipad|tablet/i.test(navigator.userAgent)?"tablet":/mobile|iphone|android/i.test(navigator.userAgent)?"mobile":"desktop";
  const referrer=(()=>{try{return document.referrer?new URL(document.referrer).hostname:""}catch{return ""}})();
  const send=(view:boolean)=>{if(document.visibilityState!=="visible")return;void cmsSupabase.rpc("site_analytics_track",{p_visitor:visitor,p_path:pathname,p_device:device,p_referrer:referrer,p_view:view}).then(()=>{});};
  send(last.current!==pathname);last.current=pathname;
  const timer=window.setInterval(()=>send(false),10000);
  const visible=()=>{if(document.visibilityState==="visible")send(false)};
  document.addEventListener("visibilitychange",visible);
  return()=>{window.clearInterval(timer);document.removeEventListener("visibilitychange",visible)};
 },[pathname]);
 return null;
}