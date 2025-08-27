import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import React, { useState, useCallback, useEffect } from "react"
import { BottomBar, type Cmd } from "./Toolbar"

type Props = {
  content: string
  onChange: (html: string) => void
}

const RichTextEditor: React.FC<Props> = ({ content, onChange }) => {
  const [activeStates, setActiveStates] = useState<Partial<Record<Cmd, boolean>>>({})

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Schreibe hier …",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
      setActiveStates({
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        strike: editor.isActive("strike"),
        bullet: editor.isActive("bulletList"),
        ordered: editor.isActive("orderedList"),
      })
    },
  })

  const handleExec = useCallback((cmd: Cmd) => {
    if (!editor) return
    const chain = editor.chain().focus()
    switch (cmd) {
      case "bold": chain.toggleBold().run(); break
      case "italic": chain.toggleItalic().run(); break
      case "strike": chain.toggleStrike().run(); break
      case "bullet": chain.toggleBulletList().run(); break
      case "ordered": chain.toggleOrderedList().run(); break
    }
  }, [editor])

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content, { emitUpdate: false })
    }
  }, [content, editor])

  if (!editor) return null

  return (
    <div className="relative">
      {/* EINGABEFELD – deutlich abgehoben vom Hintergrund */}
      <div
        className="
          rounded-xl border shadow-sm overflow-hidden
          bg-white text-slate-900 border-slate-300
          focus-within:ring-2 focus-within:ring-sky-400
          dark:bg-slate-800/85 dark:text-slate-100 dark:border-white/15
        "
      >
        <div className="p-3 md:p-4">
          <EditorContent
            editor={editor}
            className="
              min-h-48 md:min-h-56 outline-none leading-relaxed caret-sky-500
              placeholder:text-slate-400 dark:placeholder:text-slate-400
              selection:bg-sky-200/50 dark:selection:bg-sky-400/30
              [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-6
              [&_p]:mb-2 last:[&_p]:mb-0
            "
          />
        </div>
      </div>

      {/* Platz für die Bottom-Bar */}
      <div className="h-16" />

      {/* Toolbar unten */}
      <BottomBar active={activeStates} onExec={handleExec} />
    </div>
  )
}

export default RichTextEditor
