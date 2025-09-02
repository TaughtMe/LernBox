// src/components/RichTextEditor/Toolbar.tsx
import React from 'react'
import { Editor } from '@tiptap/react'
import { MdFormatListBulleted, MdFormatListNumbered } from 'react-icons/md'

type ToolbarProps = {
  editor: Editor | null
}

export const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
  if (!editor) return null

  const exec = (fn: () => boolean) => () => {
    editor.chain().focus()
    fn()
  }

  const setColor = (color: string) => {
    editor.chain().focus().setColor(color).run()
  }

  const clearColor = () => {
    editor.chain().focus().unsetColor().run()
  }

  return (
    <div className="rte-toolbar" role="toolbar" aria-label="Rich Text Toolbar">
      <button
        type="button"
        className={`rte-btn ${editor.isActive('bold') ? 'is-active' : ''}`}
        onClick={exec(() => editor.chain().toggleBold().run())}
        aria-label="Fett"
      >
        <strong>F</strong>
      </button>

      <button
        type="button"
        className={`rte-btn ${editor.isActive('italic') ? 'is-active' : ''}`}
        onClick={exec(() => editor.chain().toggleItalic().run())}
        aria-label="Kursiv"
      >
        <em>K</em>
      </button>

      <button
        type="button"
        className={`rte-btn ${editor.isActive('underline') ? 'is-active' : ''}`}
        onClick={exec(() => editor.chain().toggleUnderline().run())}
        aria-label="Unterstrichen"
      >
        <u>U</u>
      </button>

      <span className="rte-sep" />

      <button
        type="button"
        className={`rte-btn ${editor?.isActive('bulletList') ? 'active' : ''}`}
        onMouseDown={(e) => {
          e.preventDefault()
          editor?.chain().focus().toggleBulletList().run()
        }}
        aria-label="Aufzählungsliste"
        title="Aufzählungsliste"
      >
        <MdFormatListBulleted />
      </button>

      {/* Nummerierung */}
      <button
        type="button"
        className={`rte-btn ${editor?.isActive('orderedList') ? 'active' : ''}`}
        onMouseDown={(e) => {
          e.preventDefault()
          editor?.chain().focus().toggleOrderedList().run()
        }}
        aria-label="Nummerierte Liste"
        title="Nummerierte Liste"
      >
        <MdFormatListNumbered />
      </button>

      <span className="rte-sep" />

      <label className="rte-color">
        <input
          type="color"
          onChange={(e) => setColor(e.target.value)}
          aria-label="Textfarbe"
        />
      </label>
      <button
        type="button"
        className="rte-btn"
        onClick={clearColor}
        aria-label="Farbe entfernen"
        title="Farbe entfernen"
      >
        ⨯
      </button>
    </div>
  )
}
