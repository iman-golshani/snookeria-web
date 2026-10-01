import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl="https://snookeria.ir";
  const cms=createClient(process.env.NEXT_PUBLIC_CMS_SUPABASE_URL!,process.env.NEXT_PUBLIC_CMS_SUPABASE_ANON_KEY!,{auth:{persistSession:false}});
  const {data:posts}=await cms.from("posts").select("slug,updated_at").eq("status","published");

  const staticPages:MetadataRoute.Sitemap=[
    {url:baseUrl,lastModified:new Date(),changeFrequency:"weekly",priority:1},
    {url:`${baseUrl}/discover`,lastModified:new Date(),changeFrequency:"daily",priority:.9},
    {url:`${baseUrl}/coach/iman-golshani`,lastModified:new Date(),changeFrequency:"monthly",priority:.9},
    {url:`${baseUrl}/tournaments`,lastModified:new Date(),changeFrequency:"daily",priority:.9},
    {url:`${baseUrl}/live`,lastModified:new Date(),changeFrequency:"always",priority:.8},
    {url:`${baseUrl}/workshops`,lastModified:new Date(),changeFrequency:"weekly",priority:.8},
  ];

  const articlePages:MetadataRoute.Sitemap=(posts??[]).map(post=>({
    url:`${baseUrl}/discover/${post.slug}`,
    lastModified:post.updated_at?new Date(post.updated_at):new Date(),
    changeFrequency:"monthly",
    priority:.8,
  }));

  return [...staticPages,...articlePages];
}
