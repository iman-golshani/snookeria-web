const map: Record<string,string> = {
"ا":"a","آ":"a","ب":"b","پ":"p","ت":"t","ث":"s","ج":"j","چ":"ch","ح":"h","خ":"kh",
"د":"d","ذ":"z","ر":"r","ز":"z","ژ":"zh","س":"s","ش":"sh","ص":"s","ض":"z","ط":"t",
"ظ":"z","ع":"a","غ":"gh","ف":"f","ق":"gh","ک":"k","ك":"k","گ":"g","ل":"l","م":"m",
"ن":"n","و":"o","ه":"h","ی":"i","ي":"i","ئ":"i","ء":"","ؤ":"o","ة":"h"
};
export function makeEnglishSlug(value:string) {
  const normalized=value.trim().toLowerCase().replace(/[أإ]/g,"ا");
  let out="";
  for (const ch of normalized) out += map[ch] ?? ch;
  return out.replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"");
}
