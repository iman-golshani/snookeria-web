          <section className="rounded-[20px] border border-[#1b9b68]/14 bg-[#092522]/70 p-5">
            <div className="flex items-center gap-2"><ImagePlus size={16} className="text-[#55d49a]"/><p className="text-xs font-bold">تصویر شاخص</p></div>
            {cover ? <div className="mt-4 overflow-hidden rounded-2xl border border-white/[.07]"><img src={cover} alt="" className="aspect-square w-full object-cover"/><button onClick={()=>setCover("")} className="w-full bg-[var(--surface-raised)] py-2 text-[10px] text-[#ff6871]">حذف تصویر</button></div> :
            <label className="mt-4 flex aspect-square max-h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#35b77d]/25 bg-[#071b1d] text-center">
              {uploading?<Loader2 size={20} className="animate-spin text-[#55d49a]"/>:<Upload size={20} className="text-[#55d49a]"/>}
              <span className="mt-2 text-[10px] text-white/35">{uploading?"در حال آپلود...":"انتخاب و آپلود تصویر"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={uploadImage} disabled={uploading}/>
            </label>}
          </section>


          {error && <div className="rounded-2xl border border-[#e3222b]/20 bg-[#e3222b]/8 px-4 py-3 text-xs text-[#ff6871]">{error}</div>}

          <section className="rounded-[20px] border border-white/[.08] bg-[var(--surface)] shadow-[0_14px_40px_rgba(0,0,0,.14)] p-5 sm:p-6">
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="عنوان مطلب..." className="w-full bg-transparent text-2xl font-black outline-none placeholder:text-white/18 sm:text-3xl"/>
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#06151e] px-3 py-2 text-[10px] text-[var(--muted)]">
              <span dir="ltr">snookeria.ir/discover/</span>
              <input dir="ltr" value={slug} onChange={e=>{setSlugTouched(true);setSlug(makeEnglishSlug(e.target.value))}} className="min-w-0 flex-1 bg-transparent text-left text-[#55d49a] outline-none"/>
            </div>
            <textarea value={excerpt} onChange={e=>setExcerpt(e.target.value)} rows={3} placeholder="خلاصه کوتاه مطلب..." className="mt-4 w-full resize-none rounded-2xl border border-white/[.07] bg-[var(--surface-raised)] p-4 text-sm leading-7 outline-none placeholder:text-white/20 focus:border-[#1b9b68]/35"/>
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between px-1"><h2 className="text-sm font-bold">متن مطلب</h2><span className="text-[9px] text-white/25">RICH TEXT EDITOR</span></div>
            <RichTextEditor value={body} onChange={setBody}/>
          </section>

          <section className="rounded-[20px] border border-[#1b9b68]/15 bg-gradient-to-br from-[#0b292b]/80 to-[#081923]/90 p-5 sm:p-6">
            <div className="flex items-center gap-3"><Search size={18} className="text-[#55d49a]"/><div><p className="text-[10px] text-[#55d49a]">SEO</p><h2 className="text-base font-black">بهینه‌سازی برای گوگل</h2></div></div>
            <div className="mt-5 grid gap-4">
              <Field label="عنوان سئو" value={seoTitle} set={setSeoTitle} hint={`${seoTitle.length}/60`}/>
              <Field label="Meta Description" value={seoDescription} set={setSeoDescription} textarea hint={`${seoDescription.length}/160`}/>
              <div className="grid gap-4 sm:grid-cols-2"><Field label="کلمه کلیدی اصلی" value={focusKeyword} set={setFocusKeyword}/><Field label="کلمات کلیدی" value={keywords} set={setKeywords} placeholder="اسنوکر، آموزش اسنوکر، ..."/></div>
            </div>

            <div className="mt-6 rounded-2xl bg-white p-4 text-left" dir="ltr">
              <p className="truncate text-xs text-[#188038]">{publicUrl}</p>
              <p className="mt-1.5 text-lg leading-6 text-[#1a0dab]">{previewTitle}</p>
              <p className="mt-1 text-xs leading-5 text-[#4d5156]">{previewDescription.slice(0,160)}</p>
            </div>

            <details className="mt-5 border-t border-white/[.07] pt-4">
              <summary className="cursor-pointer text-xs font-bold text-[var(--muted)]">تنظیمات پیشرفته SEO</summary>
              <div className="mt-4 grid gap-4">
                <Field label="Canonical URL" value={canonical} set={setCanonical} dir="ltr"/>
                <div className="grid gap-4 sm:grid-cols-2"><Field label="Open Graph Title" value={ogTitle} set={setOgTitle}/><Field label="OG Image URL" value={ogImage} set={setOgImage} dir="ltr"/></div>
                <Field label="Open Graph Description" value={ogDescription} set={setOgDescription} textarea/>
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="text-xs text-white/45">Schema<select value={schemaType} onChange={e=>setSchemaType(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-white/[.08] bg-[var(--surface-raised)] px-3 text-white outline-none"><option>Article</option><option>NewsArticle</option><option>BlogPosting</option><option>VideoObject</option></select></label>
                  <Toggle label="Index" value={robotsIndex} set={setRobotsIndex}/>
                  <Toggle label="Follow" value={robotsFollow} set={setRobotsFollow}/>
                </div>
              </div>
            </details>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-[20px] border border-white/[.07] bg-[var(--surface)] p-5">
            <p className="text-xs font-bold">تنظیمات انتشار</p>
            <Link href="/admin/categories" className="mt-3 block text-xs text-red-400">مدیریت دسته‌بندی‌ها</Link><div className="mt-4 space-y-3"><p className="text-xs text-white/60">دسته‌بندی‌های مطلب (امکان انتخاب چند مورد)</p><label className="flex items-center gap-2 text-xs text-white"><input type="checkbox" checked disabled className="accent-red-500"/>اسنوکریا — دسته اصلی تمام مطالب</label>{categories.filter(([v])=>v!=="snookeria").map(([v,l])=><label key={v} className="flex items-center gap-2 text-xs text-white/75"><input type="checkbox" checked={selectedCategories.includes(v)} onChange={e=>setSelectedCategories(prev=>e.target.checked?[...new Set([...prev,v])]:prev.filter(x=>x!==v))} className="accent-red-500"/>{l}</label>)}</div>
            <label className="mt-4 flex items-center justify-between rounded-xl bg-[var(--surface-raised)] px-3 py-3 text-xs text-[var(--muted)]"><span>مطلب ویژه</span><input type="checkbox" checked={featured} onChange={e=>setFeatured(e.target.checked)} className="accent-[#20a86b]"/></label>
          </section>

          <section className="rounded-[20px] border border-white/[.07] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-2"><Settings2 size={15} className="text-white/35"/><p className="text-xs font-bold">وضعیت SEO</p></div>
            <div className="mt-4 space-y-2 text-[10px]">
              <SeoCheck ok={title.length>10} text="عنوان مناسب"/>
              <SeoCheck ok={seoDescription.length>=80 && seoDescription.length<=160} text="Meta Description"/>
              <SeoCheck ok={!!focusKeyword} text="کلمه کلیدی اصلی"/>
              <SeoCheck ok={!!cover} text="تصویر شاخص"/>
              <SeoCheck ok={body.length>300} text="محتوای کافی"/>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

function Field({label,value,set,textarea=false,hint,placeholder,dir}: {label:string;value:string;set:(v:string)=>void;textarea?:boolean;hint?:string;placeholder?:string;dir?:"ltr"|"rtl"}) {
  const cls="mt-2 w-full rounded-xl border border-white/[.08] bg-[var(--surface-raised)] px-3 py-3 text-xs text-white outline-none focus:border-[#1b9b68]/40";
  return <label className="text-[10px] text-[var(--muted)]"><span className="flex justify-between"><span>{label}</span>{hint&&<span dir="ltr">{hint}</span>}</span>{textarea?<textarea dir={dir} rows={3} value={value} onChange={e=>set(e.target.value)} placeholder={placeholder} className={cls+" resize-none"}/>:<input dir={dir} value={value} onChange={e=>set(e.target.value)} placeholder={placeholder} className={cls}/>}</label>;
}
function Toggle({label,value,set}:{label:string;value:boolean;set:(v:boolean)=>void}) { return <label className="mt-5 flex items-center justify-between rounded-xl bg-[var(--surface-raised)] px-3 py-3 text-xs text-[var(--muted)]"><span>{label}</span><input type="checkbox" checked={value} onChange={e=>set(e.target.checked)} className="accent-[#20a86b]"/></label>; }
function SeoCheck({ok,text}:{ok:boolean;text:string}) { return <div className="flex items-center gap-2"><span className={`h-1.5 w-1.5 rounded-full ${ok?"bg-[#35c986]":"bg-white/15"}`}/><span className={ok?"text-[var(--muted)]":"text-white/25"}>{text}</span></div>; }
          {error && <div className="rounded-2xl border border-[#e3222b]/20 bg-[#e3222b]/8 px-4 py-3 text-xs text-[#ff6871]">{error}</div>}

          <section className="rounded-[20px] border border-white/[.08] bg-[var(--surface)] shadow-[0_14px_40px_rgba(0,0,0,.14)] p-5 sm:p-6">
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="عنوان مطلب..." className="w-full bg-transparent text-2xl font-black outline-none placeholder:text-white/18 sm:text-3xl"/>
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#06151e] px-3 py-2 text-[10px] text-[var(--muted)]">
              <span dir="ltr">snookeria.ir/discover/</span>
              <input dir="ltr" value={slug} onChange={e=>{setSlugTouched(true);setSlug(makeEnglishSlug(e.target.value))}} className="min-w-0 flex-1 bg-transparent text-left text-[#55d49a] outline-none"/>
            </div>
            <textarea value={excerpt} onChange={e=>setExcerpt(e.target.value)} rows={3} placeholder="خلاصه کوتاه مطلب..." className="mt-4 w-full resize-none rounded-2xl border border-white/[.07] bg-[var(--surface-raised)] p-4 text-sm leading-7 outline-none placeholder:text-white/20 focus:border-[#1b9b68]/35"/>
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between px-1"><h2 className="text-sm font-bold">متن مطلب</h2><span className="text-[9px] text-white/25">RICH TEXT EDITOR</span></div>
            <RichTextEditor value={body} onChange={setBody}/>
          </section>

          <section className="rounded-[20px] border border-[#1b9b68]/15 bg-gradient-to-br from-[#0b292b]/80 to-[#081923]/90 p-5 sm:p-6">
            <div className="flex items-center gap-3"><Search size={18} className="text-[#55d49a]"/><div><p className="text-[10px] text-[#55d49a]">SEO</p><h2 className="text-base font-black">بهینه‌سازی برای گوگل</h2></div></div>
            <div className="mt-5 grid gap-4">
              <Field label="عنوان سئو" value={seoTitle} set={setSeoTitle} hint={`${seoTitle.length}/60`}/>
              <Field label="Meta Description" value={seoDescription} set={setSeoDescription} textarea hint={`${seoDescription.length}/160`}/>
              <div className="grid gap-4 sm:grid-cols-2"><Field label="کلمه کلیدی اصلی" value={focusKeyword} set={setFocusKeyword}/><Field label="کلمات کلیدی" value={keywords} set={setKeywords} placeholder="اسنوکر، آموزش اسنوکر، ..."/></div>
            </div>

            <div className="mt-6 rounded-2xl bg-white p-4 text-left" dir="ltr">
              <p className="truncate text-xs text-[#188038]">{publicUrl}</p>
              <p className="mt-1.5 text-lg leading-6 text-[#1a0dab]">{previewTitle}</p>
              <p className="mt-1 text-xs leading-5 text-[#4d5156]">{previewDescription.slice(0,160)}</p>
            </div>

            <details className="mt-5 border-t border-white/[.07] pt-4">
              <summary className="cursor-pointer text-xs font-bold text-[var(--muted)]">تنظیمات پیشرفته SEO</summary>
              <div className="mt-4 grid gap-4">
                <Field label="Canonical URL" value={canonical} set={setCanonical} dir="ltr"/>
                <div className="grid gap-4 sm:grid-cols-2"><Field label="Open Graph Title" value={ogTitle} set={setOgTitle}/><Field label="OG Image URL" value={ogImage} set={setOgImage} dir="ltr"/></div>
                <Field label="Open Graph Description" value={ogDescription} set={setOgDescription} textarea/>
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="text-xs text-white/45">Schema<select value={schemaType} onChange={e=>setSchemaType(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-white/[.08] bg-[var(--surface-raised)] px-3 text-white outline-none"><option>Article</option><option>NewsArticle</option><option>BlogPosting</option><option>VideoObject</option></select></label>
                  <Toggle label="Index" value={robotsIndex} set={setRobotsIndex}/>
                  <Toggle label="Follow" value={robotsFollow} set={setRobotsFollow}/>
                </div>
              </div>
            </details>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-[20px] border border-white/[.07] bg-[var(--surface)] p-5">
            <p className="text-xs font-bold">تنظیمات انتشار</p>
            <Link href="/admin/categories" className="mt-3 block text-xs text-red-400">مدیریت دسته‌بندی‌ها</Link><div className="mt-4 space-y-3"><p className="text-xs text-white/60">دسته‌بندی‌های مطلب (امکان انتخاب چند مورد)</p><label className="flex items-center gap-2 text-xs text-white"><input type="checkbox" checked disabled className="accent-red-500"/>اسنوکریا — دسته اصلی تمام مطالب</label>{categories.filter(([v])=>v!=="snookeria").map(([v,l])=><label key={v} className="flex items-center gap-2 text-xs text-white/75"><input type="checkbox" checked={selectedCategories.includes(v)} onChange={e=>setSelectedCategories(prev=>e.target.checked?[...new Set([...prev,v])]:prev.filter(x=>x!==v))} className="accent-red-500"/>{l}</label>)}</div>
            <label className="mt-4 flex items-center justify-between rounded-xl bg-[var(--surface-raised)] px-3 py-3 text-xs text-[var(--muted)]"><span>مطلب ویژه</span><input type="checkbox" checked={featured} onChange={e=>setFeatured(e.target.checked)} className="accent-[#20a86b]"/></label>
          </section>

          <section className="rounded-[20px] border border-white/[.07] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-2"><Settings2 size={15} className="text-white/35"/><p className="text-xs font-bold">وضعیت SEO</p></div>
            <div className="mt-4 space-y-2 text-[10px]">
              <SeoCheck ok={title.length>10} text="عنوان مناسب"/>
              <SeoCheck ok={seoDescription.length>=80 && seoDescription.length<=160} text="Meta Description"/>
              <SeoCheck ok={!!focusKeyword} text="کلمه کلیدی اصلی"/>
              <SeoCheck ok={!!cover} text="تصویر شاخص"/>
              <SeoCheck ok={body.length>300} text="محتوای کافی"/>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

function Field({label,value,set,textarea=false,hint,placeholder,dir}: {label:string;value:string;set:(v:string)=>void;textarea?:boolean;hint?:string;placeholder?:string;dir?:"ltr"|"rtl"}) {
  const cls="mt-2 w-full rounded-xl border border-white/[.08] bg-[var(--surface-raised)] px-3 py-3 text-xs text-white outline-none focus:border-[#1b9b68]/40";
  return <label className="text-[10px] text-[var(--muted)]"><span className="flex justify-between"><span>{label}</span>{hint&&<span dir="ltr">{hint}</span>}</span>{textarea?<textarea dir={dir} rows={3} value={value} onChange={e=>set(e.target.value)} placeholder={placeholder} className={cls+" resize-none"}/>:<input dir={dir} value={value} onChange={e=>set(e.target.value)} placeholder={placeholder} className={cls}/>}</label>;
}
function Toggle({label,value,set}:{label:string;value:boolean;set:(v:boolean)=>void}) { return <label className="mt-5 flex items-center justify-between rounded-xl bg-[var(--surface-raised)] px-3 py-3 text-xs text-[var(--muted)]"><span>{label}</span><input type="checkbox" checked={value} onChange={e=>set(e.target.checked)} className="accent-[#20a86b]"/></label>; }
function SeoCheck({ok,text}:{ok:boolean;text:string}) { return <div className="flex items-center gap-2"><span className={`h-1.5 w-1.5 rounded-full ${ok?"bg-[#35c986]":"bg-white/15"}`}/><span className={ok?"text-[var(--muted)]":"text-white/25"}>{text}</span></div>; }      <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-7"><div className="mb-4 flex items-center justify-between"><div><p className="text-[10px] font-bold text-[var(--accent)]">CONTENT EDITOR</p><h1 className="mt-1 text-xl font-black">{editingId?"ویرایش کامل مطلب":"ساخت مطلب جدید"}</h1></div>{editingId&&<button onClick={()=>void deletePost(editingId,title)} className="rounded-xl bg-red-500/10 px-3 py-2 text-xs text-red-400">حذف مطلب</button>}</div><div className="grid gap-4 lg:grid-cols-2">          <section className="rounded-[20px] border border-[var(--edge)] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-2"><ImagePlus size={16} className="text-[#55d49a]"/><p className="text-xs font-bold">تصویر شاخص</p></div>
            {cover ? <div className="mt-4 overflow-hidden rounded-2xl border border-white/[.07]"><img src={cover} alt="" className="aspect-square max-h-80 w-full object-contain bg-black/20"/><button onClick={()=>setCover("")} className="w-full bg-[var(--surface-raised)] py-2 text-[10px] text-[#ff6871]">حذف تصویر</button><label className="block cursor-pointer bg-[var(--surface-raised)] py-3 text-center text-xs text-[var(--ink)]">تعویض تصویر<input type="file" accept="image/*" className="hidden" onChange={uploadImage} disabled={uploading}/></label></div> :
            <label className="mt-4 flex aspect-square max-h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#35b77d]/25 bg-[#071b1d] text-center">
              {uploading?<Loader2 size={20} className="animate-spin text-[#55d49a]"/>:<Upload size={20} className="text-[#55d49a]"/>}
              <span className="mt-2 text-[10px] text-white/35">{uploading?"در حال آپلود...":"انتخاب و آپلود تصویر"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={uploadImage} disabled={uploading}/>
            </label>}
          </section>


          <section className="rounded-[20px] border border-white/[.07] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-2"><Images size={16} className="text-[#55d49a]"/><p className="text-xs font-bold">اسلایدهای پست</p></div>
            <p className="mt-2 text-[10px] leading-5 text-[var(--muted)]">{editingId?"چند عکس یا ویدئو انتخاب کن؛ ترتیب همین لیست در Discover نمایش داده می‌شود.":"اول پست را به‌صورت پیش‌نویس ذخیره کن، سپس برای ویرایش بازش کن و اسلایدها را اضافه کن."}</p>
            {media.length>0&&<div className="mt-4 space-y-2">{media.map((m,i)=><div key={m.id} className="flex items-center gap-2 rounded-xl bg-[var(--surface-raised)] p-2">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-black/20">{m.media_type==="video"?<video src={m.media_url} className="h-full w-full object-cover"/>:<img src={m.media_url} alt="" className="h-full w-full object-cover"/>}</div>
              <span className="flex-1 text-[10px] text-white/45">اسلاید {(i+1).toLocaleString("fa-IR")} · {m.media_type==="video"?"ویدئو":"تصویر"}</span>
              <button onClick={()=>moveMedia(i,-1)} disabled={i===0} className="p-2 text-[var(--muted)] disabled:opacity-15"><ArrowUp size={13}/></button>
              <button onClick={()=>moveMedia(i,1)} disabled={i===media.length-1} className="p-2 text-[var(--muted)] disabled:opacity-15"><ArrowDown size={13}/></button>
              <button onClick={()=>removeMedia(m)} className="p-2 text-[#ff5964]"><Trash2 size={13}/></button>
            </div>)}</div>}
            <label className={`mt-4 flex min-h-20 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-[#35b77d]/25 bg-[#071b1d] text-center ${!editingId?"pointer-events-none opacity-40":""}`}>
              {mediaUploading?<Loader2 size={19} className="animate-spin text-[#55d49a]"/>:<div><Plus size={18} className="mx-auto text-[#55d49a]"/><span className="mt-1 block text-[10px] text-[var(--muted)]">افزودن عکس / ویدئو</span></div>}
              <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={uploadCarousel} disabled={!editingId||mediaUploading}/>
            </label>
          </section>

</div></div>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-7 xl:grid-cols-[minmax(0,1fr)_320px]"><div className="space-y-5">
          {error && <div className="rounded-2xl border border-[#e3222b]/20 bg-[#e3222b]/8 px-4 py-3 text-xs text-[#ff6871]">{error}</div>}

          <section className="rounded-[20px] border border-white/[.08] bg-[var(--surface)] shadow-[0_14px_40px_rgba(0,0,0,.14)] p-5 sm:p-6">
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="عنوان مطلب..." className="w-full bg-transparent text-2xl font-black outline-none placeholder:text-white/18 sm:text-3xl"/>
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#06151e] px-3 py-2 text-[10px] text-[var(--muted)]">
              <span dir="ltr">snookeria.ir/discover/</span>
              <input dir="ltr" value={slug} onChange={e=>{setSlugTouched(true);setSlug(makeEnglishSlug(e.target.value))}} className="min-w-0 flex-1 bg-transparent text-left text-[#55d49a] outline-none"/>
            </div>
            <textarea value={excerpt} onChange={e=>setExcerpt(e.target.value)} rows={3} placeholder="خلاصه کوتاه مطلب..." className="mt-4 w-full resize-none rounded-2xl border border-white/[.07] bg-[var(--surface-raised)] p-4 text-sm leading-7 outline-none placeholder:text-white/20 focus:border-[#1b9b68]/35"/>
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between px-1"><h2 className="text-sm font-bold">متن مطلب</h2><span className="text-[9px] text-white/25">RICH TEXT EDITOR</span></div>
            <RichTextEditor value={body} onChange={setBody}/>
          </section>

          <section className="rounded-[20px] border border-[#1b9b68]/15 bg-gradient-to-br from-[#0b292b]/80 to-[#081923]/90 p-5 sm:p-6">
            <div className="flex items-center gap-3"><Search size={18} className="text-[#55d49a]"/><div><p className="text-[10px] text-[#55d49a]">SEO</p><h2 className="text-base font-black">بهینه‌سازی برای گوگل</h2></div></div>
            <div className="mt-5 grid gap-4">
              <Field label="عنوان سئو" value={seoTitle} set={setSeoTitle} hint={`${seoTitle.length}/60`}/>
              <Field label="Meta Description" value={seoDescription} set={setSeoDescription} textarea hint={`${seoDescription.length}/160`}/>
              <div className="grid gap-4 sm:grid-cols-2"><Field label="کلمه کلیدی اصلی" value={focusKeyword} set={setFocusKeyword}/><Field label="کلمات کلیدی" value={keywords} set={setKeywords} placeholder="اسنوکر، آموزش اسنوکر، ..."/></div>
            </div>

            <div className="mt-6 rounded-2xl bg-white p-4 text-left" dir="ltr">
              <p className="truncate text-xs text-[#188038]">{publicUrl}</p>
              <p className="mt-1.5 text-lg leading-6 text-[#1a0dab]">{previewTitle}</p>
              <p className="mt-1 text-xs leading-5 text-[#4d5156]">{previewDescription.slice(0,160)}</p>
            </div>

            <details className="mt-5 border-t border-white/[.07] pt-4">
              <summary className="cursor-pointer text-xs font-bold text-[var(--muted)]">تنظیمات پیشرفته SEO</summary>
              <div className="mt-4 grid gap-4">
                <Field label="Canonical URL" value={canonical} set={setCanonical} dir="ltr"/>
                <div className="grid gap-4 sm:grid-cols-2"><Field label="Open Graph Title" value={ogTitle} set={setOgTitle}/><Field label="OG Image URL" value={ogImage} set={setOgImage} dir="ltr"/></div>
                <Field label="Open Graph Description" value={ogDescription} set={setOgDescription} textarea/>
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="text-xs text-white/45">Schema<select value={schemaType} onChange={e=>setSchemaType(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-white/[.08] bg-[var(--surface-raised)] px-3 text-white outline-none"><option>Article</option><option>NewsArticle</option><option>BlogPosting</option><option>VideoObject</option></select></label>
                  <Toggle label="Index" value={robotsIndex} set={setRobotsIndex}/>
                  <Toggle label="Follow" value={robotsFollow} set={setRobotsFollow}/>
                </div>
              </div>
            </details>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-[20px] border border-white/[.07] bg-[var(--surface)] p-5">
            <p className="text-xs font-bold">تنظیمات انتشار</p>
            <Link href="/admin/categories" className="mt-3 block text-xs text-red-400">مدیریت دسته‌بندی‌ها</Link><div className="mt-4 space-y-3"><p className="text-xs text-white/60">دسته‌بندی‌های مطلب (امکان انتخاب چند مورد)</p><label className="flex items-center gap-2 text-xs text-white"><input type="checkbox" checked disabled className="accent-red-500"/>اسنوکریا — دسته اصلی تمام مطالب</label>{categories.filter(([v])=>v!=="snookeria").map(([v,l])=><label key={v} className="flex items-center gap-2 text-xs text-white/75"><input type="checkbox" checked={selectedCategories.includes(v)} onChange={e=>setSelectedCategories(prev=>e.target.checked?[...new Set([...prev,v])]:prev.filter(x=>x!==v))} className="accent-red-500"/>{l}</label>)}</div>
            <label className="mt-4 flex items-center justify-between rounded-xl bg-[var(--surface-raised)] px-3 py-3 text-xs text-[var(--muted)]"><span>مطلب ویژه</span><input type="checkbox" checked={featured} onChange={e=>setFeatured(e.target.checked)} className="accent-[#20a86b]"/></label>
          </section>

          <section className="rounded-[20px] border border-white/[.07] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-2"><Settings2 size={15} className="text-white/35"/><p className="text-xs font-bold">وضعیت SEO</p></div>
            <div className="mt-4 space-y-2 text-[10px]">
              <SeoCheck ok={title.length>10} text="عنوان مناسب"/>
              <SeoCheck ok={seoDescription.length>=80 && seoDescription.length<=160} text="Meta Description"/>
              <SeoCheck ok={!!focusKeyword} text="کلمه کلیدی اصلی"/>
              <SeoCheck ok={!!cover} text="تصویر شاخص"/>
              <SeoCheck ok={body.length>300} text="محتوای کافی"/>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

function Field({label,value,set,textarea=false,hint,placeholder,dir}: {label:string;value:string;set:(v:string)=>void;textarea?:boolean;hint?:string;placeholder?:string;dir?:"ltr"|"rtl"}) {
  const cls="mt-2 w-full rounded-xl border border-white/[.08] bg-[var(--surface-raised)] px-3 py-3 text-xs text-white outline-none focus:border-[#1b9b68]/40";
  return <label className="text-[10px] text-[var(--muted)]"><span className="flex justify-between"><span>{label}</span>{hint&&<span dir="ltr">{hint}</span>}</span>{textarea?<textarea dir={dir} rows={3} value={value} onChange={e=>set(e.target.value)} placeholder={placeholder} className={cls+" resize-none"}/>:<input dir={dir} value={value} onChange={e=>set(e.target.value)} placeholder={placeholder} className={cls}/>}</label>;
}
function Toggle({label,value,set}:{label:string;value:boolean;set:(v:boolean)=>void}) { return <label className="mt-5 flex items-center justify-between rounded-xl bg-[var(--surface-raised)] px-3 py-3 text-xs text-[var(--muted)]"><span>{label}</span><input type="checkbox" checked={value} onChange={e=>set(e.target.checked)} className="accent-[#20a86b]"/></label>; }
function SeoCheck({ok,text}:{ok:boolean;text:string}) { return <div className="flex items-center gap-2"><span className={`h-1.5 w-1.5 rounded-full ${ok?"bg-[#35c986]":"bg-white/15"}`}/><span className={ok?"text-[var(--muted)]":"text-white/25"}>{text}</span></div>; }
