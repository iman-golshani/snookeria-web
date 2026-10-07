"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Quote, Undo2, Redo2, Link2, Unlink, Minus
} from "lucide-react";

type Props = { value: string; onChange: (html: string) => void };

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-[420px] px-5 py-5 text-sm leading-8 text-white/80 outline-none [&_h2]:mt-7 [&_h2]:text-xl [&_h2]:font-black [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_p]:my-3 [&_blockquote]:my-5 [&_blockquote]:border-r-2 [&_blockquote]:border-[#20a86b] [&_blockquote]:pr-4 [&_blockquote]:text-white/55 [&_ul]:mr-5 [&_ul]:list-disc [&_ol]:mr-5 [&_ol]:list-decimal [&_a]:text-[#55d49a] [&_a]:underline",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const button = (active = false) =>
    `flex h-8 w-8 items-center justify-center rounded-lg transition ${active ? "bg-[#1b9b68]/20 text-[#5ddd9f]" : "text-white/45 hover:bg-white/[0.05] hover:text-white"}`;

  function setLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("آدرس لینک را وارد کنید", previous || "https://");
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  return (
    <div className="overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#071821]/80">
      <div className="flex flex-wrap items-center gap-1 border-b border-white/[0.07] bg-[#0a2029]/80 p-2">
        <button type="button" className={button(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold"><Bold size={15}/></button>
        <button type="button" className={button(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic"><Italic size={15}/></button>
        <span className="mx-1 h-5 w-px bg-white/10"/>
        <button type="button" className={button(editor.isActive("heading",{level:2}))} onClick={() => editor.chain().focus().toggleHeading({level:2}).run()} title="Heading 2"><Heading2 size={16}/></button>
        <button type="button" className={button(editor.isActive("heading",{level:3}))} onClick={() => editor.chain().focus().toggleHeading({level:3}).run()} title="Heading 3"><Heading3 size={16}/></button>
        <button type="button" className={button(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()} title="لیست"><List size={16}/></button>
        <button type="button" className={button(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="لیست شماره‌دار"><ListOrdered size={16}/></button>
        <button type="button" className={button(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="نقل قول"><Quote size={15}/></button>
        <button type="button" className={button()} onClick={() => editor.chain().focus().setHorizontalRule().run()} title="خط جداکننده"><Minus size={16}/></button>
        <span className="mx-1 h-5 w-px bg-white/10"/>
        <button type="button" className={button(editor.isActive("link"))} onClick={setLink} title="لینک"><Link2 size={15}/></button>
        <button type="button" className={button()} onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive("link")} title="حذف لینک"><Unlink size={15}/></button>
        <span className="mx-1 h-5 w-px bg-white/10"/>
        <button type="button" className={button()} onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo2 size={15}/></button>
        <button type="button" className={button()} onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo2 size={15}/></button>
      </div>
      <EditorContent editor={editor}/>
    </div>
  );
}
