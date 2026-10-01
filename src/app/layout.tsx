import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import PWARegister from "@/components/PWARegister";

export const metadata: Metadata = {
  metadataBase: new URL("https://snookeria.ir"),
  title: { default:"اسنوکریا | جایی برای زندگی کردن اسنوکر", template:"%s | اسنوکریا" },
  description:"اسنوکریا؛ آموزش تخصصی اسنوکر، تمرین، آنالیز، مسابقات و دنیای اسنوکر با ایمان گلشنی.",
  keywords:["ایمان گلشنی","اسنوکریا","Snookeria","آموزش اسنوکر","مربی اسنوکر","آموزش بیلیارد","مسابقات اسنوکر"],
  authors:[{name:"ایمان گلشنی",url:"https://snookeria.ir"}],
  creator:"ایمان گلشنی", publisher:"اسنوکریا",
  manifest:"/manifest.webmanifest",
  icons:{icon:[{url:"/favicon.ico",type:"image/x-icon"},{url:"/favicon-32x32.png",sizes:"32x32",type:"image/png"}],apple:[{url:"/apple-touch-icon.png",sizes:"180x180",type:"image/png"}]},
  openGraph:{type:"website",locale:"fa_IR",url:"https://snookeria.ir",siteName:"Snookeria",title:"اسنوکریا | جایی برای زندگی کردن اسنوکر",description:"اسنوکر برای ما فقط یک بازی نیست؛ یک سبک زندگی است.",images:[{url:"/snookeria-icon-1024.png",width:1024,height:1024,alt:"Snookeria"}]},
  twitter:{card:"summary",title:"اسنوکریا",description:"جایی برای زندگی کردن اسنوکر",images:["/snookeria-icon-1024.png"]},
  robots:{index:true,follow:true,googleBot:{index:true,follow:true,"max-image-preview":"large","max-snippet":-1,"max-video-preview":-1}},
};
export const viewport:Viewport={themeColor:"#06111c",width:"device-width",initialScale:1,viewportFit:"cover"};

export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="fa" dir="rtl" className="bg-[#06111c]"><body className="min-h-screen bg-[#06111c] pt-[calc(54px+env(safe-area-inset-top))] text-white antialiased"><Header/>{children}<BottomNav/><PWARegister/></body></html>;
}
