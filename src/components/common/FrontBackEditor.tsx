import { useMemo, useState, useCallback, type ReactNode } from "react"
import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { BottomBar, InlineBar, type Cmd } from "./Toolbar"

type Props = {
  frontHtml: string
  backHtml: string
  onChangeFront: (html: string) => void
  onChangeBack: (html: string) => void
  /** Optional: schwebende globale Bottom-Bar zusätzlich zeigen */
  showBottomBar?: boolean
}

type ActiveMap = Partial<Record<Cmd, boolean>>

function getActive(editor: Editor | null): ActiveMap {
  if (!editor) return {}
  return {
    bold: editor.isActive("bold"),
    italic: editor.isActive("italic"),
    strike: editor.isActive("strike"),
    bullet: editor.isActive("bulletList"),
    ordered: editor.isActive("orderedList"),
  }
}

export default function FrontBackEditor({
  frontHtml,
  backHtml,
  onChangeFront,
  onChangeBack,
  showBottomBar = false,        // << standardmäßig AUS, damit es nicht doppelt wirkt
}: Props) {
  const [focused, setFocused] = useState<"front" | "back">("front")

  const frontEditor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: "Schreibe hier …" })],
    content: frontHtml,
    onUpdate: ({ editor }) => onChangeFront(editor.getHTML()),
    editorProps: {
      attributes: { "aria-label": "Vorderseite" },
      handleDOMEvents: { focus: () => { setFocused("front"); return false } },
    },
  })

  const backEditor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: "Schreibe hier …" })],
    content: backHtml,
    onUpdate: ({ editor }) => onChangeBack(editor.getHTML()),
    editorProps: {
      attributes: { "aria-label": "Rückseite" },
      handleDOMEvents: { focus: () => { setFocused("back"); return false } },
    },
  })

  const frontActive = useMemo(() => getActive(frontEditor), [frontEditor?.state])
  const backActive  = useMemo(() => getActive(backEditor),  [backEditor?.state])

  const execFor = useCallback((ed: Editor | null, cmd: Cmd) => {
    if (!ed) return
    const chain = ed.chain().focus()
    switch (cmd) {
      case "bold": chain.toggleBold().run(); break
      case "italic": chain.toggleItalic().run(); break
      case "strike": chain.toggleStrike().run(); break
      case "bullet": chain.toggleBulletList().run(); break
      case "ordered": chain.toggleOrderedList().run(); break
    }
  }, [])

  const activeEditor = focused === "front" ? frontEditor : backEditor
  const bottomActive = useMemo(() => getActive(activeEditor), [activeEditor?.state])
  const bottomExec = useCallback((cmd: Cmd) => execFor(activeEditor, cmd), [activeEditor, execFor])

  return (
    <div className="relative space-y-6">

      {/* Vorderseite */}
      <section className="space-y-2">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Vorderseite</h3>
        <InlineBar active={frontActive} onExec={(cmd) => execFor(frontEditor, cmd)} />
        <CardEditorSurface>
          <EditorContent
            editor={frontEditor}
            className="
              min-h-[8rem] md:min-h-[10rem] outline-none leading-relaxed caret-sky-500
              selection:bg-sky-200/50 dark:selection:bg-sky-400/30
              [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-6
              [&_p]:mb-2 last:[&_p]:mb-0
            "
          />
        </CardEditorSurface>
      </section>

      {/* Rückseite */}
      <section className="space-y-2">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Rückseite</h3>
        <InlineBar active={backActive} onExec={(cmd) => execFor(backEditor, cmd)} />
        <CardEditorSurface>
          <EditorContent
            editor={backEditor}
            className="
              min-h-[8rem] md:min-h-[10rem] outline-none leading-relaxed caret-sky-500
              selection:bg-sky-200/50 dark:selection:bg-sky-400/30
              [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-6
              [&_p]:mb-2 last:[&_p]:mb-0
            "
          />
        </CardEditorSurface>
      </section>

      {/* Platz, falls Bottom-Bar aktiv ist */}
      {showBottomBar && <div className="h-16" />}

      {/* Optional: eine globale schwebende Leiste für den fokussierten Editor */}
      {showBottomBar && <BottomBar active={bottomActive} onExec={bottomExec} />}
    </div>
  )
}

function CardEditorSurface({ children }: { children: ReactNode }) {
  return (
    <div
      className="
        rounded-2xl border shadow-md
        bg-white text-slate-900 border-slate-200
        dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700
        transition-colors
      "
    >
      <div className="p-4 md:p-5">{children}</div>
    </div>
  )
}
