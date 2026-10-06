import { createClient } from "@supabase/supabase-js";
import DiscoverFeed,{type FeedPost} from "@/components/discover/DiscoverFeed";
const cms=createClient(process.env.NEXT_PUBLIC_CMS_SUPABASE_URL!,process.env.NEXT_PUBLIC_CMS_SUPABASE_ANON_KEY!,{auth:{persistSession:false}});
export const revalidate=60;
export default async function DiscoverPage(){
 const {data,error}=await cms.from("posts").select("id,title,slug,excerpt,body,cover_image_url,category,post_media(id,media_url,media_type,alt_text,sort_order)").eq("status","published").order("published_at",{ascending:false});
 // Before migration 004 is applied, retain the existing cover-only feed.
 const posts=error?(await cms.from("posts").select("id,title,slug,excerpt,body,cover_image_url,category").eq("status","published").order("published_at",{ascending:false})).data??[]:data??[];
 return <main dir="rtl" className="app-page"><div className="app-shell"><div className="mb-5 px-1"><p className="app-label">DISCOVER</p><h1 className="mt-1 text-2xl font-black text-[#0b1d33]">دنیای اسنوکر</h1><p className="mt-1 text-xs text-[#667085]">داستان، آموزش، ویدئو و چیزهایی که ارزش دیدن دارند.</p></div><DiscoverFeed posts={posts as FeedPost[]}/></div></main>;
}
