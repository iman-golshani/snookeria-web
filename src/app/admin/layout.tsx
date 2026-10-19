import type {Metadata,Viewport} from "next";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminPWAInstall from "@/components/admin/AdminPWAInstall";
export const metadata:Metadata={
title:"مدیریت اسنوکریا",applicationName:"مدیریت اسنوکریا",robots:{index:false,follow:false},
manifest:"/admin/manifest.webmanifest",
appleWebApp:{capable:true,title:"مدیریت اسنوکریا",statusBarStyle:"black-translucent"},
icons:{icon:"/admin-icon.svg",apple:"/apple-touch-icon.png"}
};
export const viewport:Viewport={themeColor:"#101a29",width:"device-width",initialScale:1,viewportFit:"cover"};
export default function AdminLayout({children}:{children:React.ReactNode}){return <div data-admin-app className="min-h-[100dvh] bg-[var(--page)]"><AdminHeader/><AdminPWAInstall/>{children}</div>}
