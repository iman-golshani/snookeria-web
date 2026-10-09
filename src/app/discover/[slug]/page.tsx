import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Share2 } from "lucide-react";

const cms=createClient(process.env.NEXT_PUBLIC_CMS_SUPABASE_URL!,process.env.NEXT_PUBLIC_CMS_SUPABASE_ANON_KEY!,{auth:{persistSession:false}});
type Params={params:Promise<{slug:string}>};

async function getPost(slug:string){
  const {data}=await cms.from("posts").select("*").eq("slug",slug).eq("status","published").maybeSingle();
  return data;
}
export async function generateMetadata({params}:Params):Promise<Metadata>{
  const {slug}=await params; const post=await getPost(slug);
  if(!post) return {};
  const url=post.canonical_url||`https://snookeria.ir/discover/${post.slug}`;
  return {
    title:post.seo_title||post.title,
    description:post.seo_description||post.excerpt||undefined,
    keywords:post.seo_keywords||undefined,
    alternates:{canonical:url},
    robots:{index:post.robots_index,follow:post.robots_follow},
    openGraph:{
      type:"article",url,title:post.og_title||post.seo_title||post.title,
      description:post.og_description||post.seo_description||post.excerpt||undefined,
      images:(post.og_image_url||post.cover_image_url)?[{url:post.og_image_url||post.cover_image_url}]:undefined,
      publishedTime:post.published_at||undefined,
    },
  };
}
export const revalidate=60;

export default async function ArticlePage({params}:Params){
  const {slug}=await params; const post=await getPost(slug); if(!post) notFound();
  const url=post.canonical_url||`https://snookeria.ir/discover/${post.slug}`;
  const schema={
    "@context":"https://schema.org","@type":post.schema_type||"Article",
    headline:post.seo_title||post.title,description:post.seo_description||post.excerpt||undefined,
    image:post.og_image_url||post.cover_image_url||undefined,datePublished:post.published_at,
    dateModified:post.updated_at,author:{"@type":"Person",name:post.author_name||"ایمان گلشنی"},
    publisher:{"@type":"Organization",name:"Snookeria"},mainEntityOfPage:url
  };
  return <main dir="rtl" className="min-h-screen bg-[#06111c] pb-28 text-white">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/>
    <article className="mx-auto max-w-4xl px-4 pt-6 sm:px-6">
      <div className="flex items-center justify-between"><span className="text-[9px] font-black tracking-[.16em] text-[#55d49a]">DISCOVER / STORY</span><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0a2029] text-white/35"><Share2 size={14}/></span></div>
      <header className="mt-5">
        
        <h1 className="text-2xl font-black leading-[1.55] sm:text-4xl">{post.title}</h1>
        {post.excerpt&&<p className="mt-4 max-w-3xl text-sm leading-8 text-white/45 sm:text-base">{post.excerpt}</p>}
      </header>
      {post.cover_image_url&&<div className="mt-7 overflow-hidden rounded-[30px] border border-white/[.07] bg-[#091b25]"><img src={post.cover_image_url} alt={post.title} className="mx-auto aspect-square w-full max-w-[720px] object-cover"/></div>}
      <div className="mt-8 rounded-[28px] border border-white/[.06] bg-[#091b25]/65 px-5 py-6 sm:px-9 sm:py-9">
        <div className="article-content text-[15px] leading-9 text-white/78 [&_a]:text-[#55d49a] [&_a]:underline [&_blockquote]:my-7 [&_blockquote]:border-r-2 [&_blockquote]:border-[#20a86b] [&_blockquote]:pr-5 [&_blockquote]:text-white/55 [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-black [&_h3]:mb-2 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-bold [&_li]:my-1 [&_ol]:my-5 [&_ol]:mr-5 [&_ol]:list-decimal [&_p]:my-4 [&_ul]:my-5 [&_ul]:mr-5 [&_ul]:list-disc" dangerouslySetInnerHTML={{__html:post.body||""}}/>
      </div>
    </article>
  </main>;
}
