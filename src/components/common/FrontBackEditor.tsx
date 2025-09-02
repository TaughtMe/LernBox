// src/components/common/FrontBackEditor.tsx
import React from 'react'
import { RichTextEditor } from '../RichTextEditor/RichTextEditor'

type FrontBackEditorProps = {
  frontHtml: string
  backHtml: string
  onChangeFront: (html: string) => void
  onChangeBack: (html: string) => void
  disabled?: boolean
  className?: string
}

const FrontBackEditor: React.FC<FrontBackEditorProps> = ({
  frontHtml,
  backHtml,
  onChangeFront,
  onChangeBack,
  disabled = false,
  className,
}) => {
  return (
    <div className={className ?? ''} style={{ display: 'grid', gap: '12px' }}>
      <div>
        <label className="face-label" htmlFor="rte-front">
          Vorderseite (VS)
        </label>
        <RichTextEditor
          id="rte-front"
          ariaLabel="Vorderseite"
          value={frontHtml}
          onChange={onChangeFront}
          placeholder="Frage/Begriff eingeben …"
          minHeight={140}
          disabled={disabled}
        />
      </div>

      <div>
        <label className="face-label" htmlFor="rte-back">
          Rückseite (RS)
        </label>
        <RichTextEditor
          id="rte-back"
          ariaLabel="Rückseite"
          value={backHtml}
          onChange={onChangeBack}
          placeholder="Antwort/Erklärung eingeben …"
          minHeight={180}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export default FrontBackEditor
