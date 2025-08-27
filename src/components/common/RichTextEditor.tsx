import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import React, { useState, useCallback, useEffect } from "react"
import { BottomBar, type Cmd } from "./Toolbar"

type Props = {
  content: string
  onChange: (html: string) => void
}

const RichTextEditor: React.FC<Props> = ({ content, onChange }) => {
  const [activeStates, setActiveStates] = useState<Partial<Record<Cmd, boolean>>>({})

  const editor = useEditor({
    extensions: [StarterKit],
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
      {/* Editor-Fläche */}
      <div className="min-h-48 bg-white/90 text-slate-900 rounded-md p-3 shadow-sm
                      md:min-h-56 md:p-4
                      dark:bg-slate-800/60 dark:text-slate-100 dark:border dark:border-white/10">
        <EditorContent editor={editor} />
      </div>

      {/* Platz, damit die schwebende BottomBar nichts überlappt */}
      <div className="h-16" />

      {/* Immer unten zentriert */}
      <BottomBar active={activeStates} onExec={handleExec} />
    </div>
  )
}

export default RichTextEditor
