import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl="https://snookeria.ir";
  const cms=createClient(process.env.NEXT_PUBLIC_CMS_SUPABASE_URL!,process.env.NEXT_PUBLIC_CMS_SUPABASE_ANON_KEY!,{auth:{persistSession:false}});
  const {data:posts}=await cms.from("posts").select("slug,updated_at").eq("status","published");

  const staticPages:MetadataRoute.Sitemap=[
    {url:baseUrl,changeFrequency:"weekly",priority:1},
    {url:`${baseUrl}/academy`,changeFrequency:"monthly",priority:.9},
    {url:`${baseUrl}/discover`,changeFrequency:"daily",priority:.9},
    {url:`${baseUrl}/coach/iman-golshani`,changeFrequency:"monthly",priority:.9},
    {url:`${baseUrl}/tournaments`,changeFrequency:"daily",priority:.9},
    {url:`${baseUrl}/live`,changeFrequency:"always",priority:.8},
    {url:`${baseUrl}/workshops`,changeFrequency:"weekly",priority:.8},
  ];

  const articlePages:MetadataRoute.Sitemap=(posts??[]).map(post=>({
    url:`${baseUrl}/discover/${post.slug}`,
    ...(post.updated_at?{lastModified:new Date(post.updated_at)}:{}),
    changeFrequency:"monthly",
    priority:.8,
  }));

  return [...staticPages,...articlePages];
}
