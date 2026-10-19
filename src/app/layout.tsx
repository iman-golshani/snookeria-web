import type { Metadata, Viewport } from "next";
import "@fontsource-variable/vazirmatn";
import "./globals.css";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import PWARegister from "@/components/PWARegister";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import PWAPullToRefresh from "@/components/PWAPullToRefresh";
import SiteAnalyticsTracker from "@/components/SiteAnalyticsTracker";

export const metadata: Metadata = {
  metadataBase: new URL("https://snookeria.ir"),
  title: { default:"اسنوکریا | جایی برای زندگی کردن اسنوکر", template:"%s | اسنوکریا" },
  description:"اسنوکریا؛ آموزش تخصصی اسنوکر، تمرین، آنالیز، مسابقات و دنیای اسنوکر با ایمان گلشنی.",
  keywords:["ایمان گلشنی","اسنوکریا","Snookeria","آموزش اسنوکر","مربی اسنوکر","آموزش بیلیارد","مسابقات اسنوکر"],
  authors:[{name:"ایمان گلشنی",url:"https://snookeria.ir"}],
  creator:"ایمان گلشنی", publisher:"اسنوکریا",
  manifest:"/manifest.webmanifest",
  icons:{icon:[{url:"/snookeria-official-32.png",sizes:"32x32",type:"image/png"},{url:"/snookeria-official-192.png",sizes:"192x192",type:"image/png"},{url:"/snookeria-official-512.png",sizes:"512x512",type:"image/png"}],apple:[{url:"/snookeria-official-180.png",type:"image/png"}]},
  openGraph:{type:"website",locale:"fa_IR",url:"https://snookeria.ir",siteName:"Snookeria",title:"اسنوکریا | جایی برای زندگی کردن اسنوکر",description:"اسنوکر برای ما فقط یک بازی نیست؛ یک سبک زندگی است.",images:[{url:"/snookeria-logo-1024.png",width:1024,height:1024,alt:"Snookeria"}]},
  twitter:{card:"summary",title:"اسنوکریا",description:"جایی برای زندگی کردن اسنوکر",images:["/snookeria-logo-1024.png"]},
  robots:{index:true,follow:true,googleBot:{index:true,follow:true,"max-image-preview":"large","max-snippet":-1,"max-video-preview":-1}},
};
export const viewport:Viewport={themeColor:"#ffffff",width:"device-width",initialScale:1,viewportFit:"cover"};

export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="fa" dir="rtl" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:"try{var t=localStorage.getItem('snookeria-site-theme');document.documentElement.dataset.theme=t==='dark'?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}"}}/></head><body className="min-h-screen pt-[calc(44px+env(safe-area-inset-top))] antialiased"><Header/>{children}<BottomNav/><PWARegister/><PWAInstallPrompt/><PWAPullToRefresh/><SiteAnalyticsTracker/></body></html>;
}
