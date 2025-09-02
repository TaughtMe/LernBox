import React, { useEffect, useMemo, useRef } from 'react'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Placeholder from '@tiptap/extension-placeholder'
import { Toolbar } from './Toolbar.tsx'
import './rte.css'

export type RichTextEditorProps = {
  id?: string // ⬅️ NEU: für Label-Zuordnung
  value: string // HTML
  onChange: (html: string) => void
  placeholder?: string
  className?: string
  minHeight?: number | string
  ariaLabel?: string
  disabled?: boolean
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  id, // ⬅️ NEU
  value,
  onChange,
  placeholder = 'Schreib etwas …',
  className,
  minHeight = 120,
  ariaLabel,
  disabled = false,
}) => {
  // Debounce-Timer für onChange
  const changeTimer = useRef<number | undefined>(undefined)
  const DEBOUNCE_MS = 200

  // Extensions (ohne Underline-Duplikat)
  const rawExtensions = useMemo(
    () => [
      Color.configure({ types: ['textStyle'] }),
      TextStyle,
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: true },
        orderedList: { keepMarks: true, keepAttributes: true },
      }),
      Placeholder.configure({ placeholder }),
    ],
    [placeholder]
  )

  // Sicherheitsnetz gegen doppelte Namen
  const extensions = useMemo(() => {
    const seen = new Set<string>()
    return rawExtensions.filter((ext: any) => {
      const name = ext?.name
      if (!name) return true
      if (seen.has(name)) return false
      seen.add(name)
      return true
    })
  }, [rawExtensions])

  const editor = useEditor({
    extensions,
    content: value || '<p></p>',
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      if (changeTimer.current) window.clearTimeout(changeTimer.current)
      changeTimer.current = window.setTimeout(() => onChange(html), DEBOUNCE_MS)
    },
  })

  // Cleanup Debounce bei Unmount
  useEffect(() => {
    return () => {
      if (changeTimer.current) window.clearTimeout(changeTimer.current)
    }
  }, [])

  // Prop -> Editor sync
  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    if (value && value !== current)
      editor.commands.setContent(value, { emitUpdate: false })
    if (!value && current !== '<p></p>')
      editor.commands.setContent('<p></p>', { emitUpdate: false })
  }, [value, editor])

  // Editierbarkeit live umschalten
  useEffect(() => {
    if (!editor) return
    editor.setEditable(!disabled)
  }, [disabled, editor])

  return (
    <div className={`rte-container ${className ?? ''}`} aria-label={ariaLabel}>
      <Toolbar editor={editor as Editor | null} />
      <div
        className="rte-editor"
        style={{
          minHeight:
            typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
        }}
      >
        {/* ⬇️ NEU: id an das contentEditable-Element weitergeben */}
        <EditorContent id={id} editor={editor} />
      </div>
    </div>
  )
}

export default RichTextEditor
