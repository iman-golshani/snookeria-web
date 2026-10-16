import {NextResponse} from "next/server";
export function GET(){return NextResponse.json({
id:"/admin/",name:"مدیریت اسنوکریا",short_name:"Snookeria Admin",
description:"پنل مدیریت محتوا، استوری‌ها و هایلایت‌های اسنوکریا",
start_url:"/admin",scope:"/admin/",display:"standalone",
background_color:"#0b111b",theme_color:"#101a29",lang:"fa",dir:"rtl",
icons:[{src:"/pwa-192x192.png",sizes:"192x192",type:"image/png",purpose:"any"},{src:"/pwa-512x512.png",sizes:"512x512",type:"image/png",purpose:"any"},{src:"/maskable-512x512.png",sizes:"512x512",type:"image/png",purpose:"maskable"}]
},{headers:{"Content-Type":"application/manifest+json; charset=utf-8","Cache-Control":"public, max-age=300"}})}
