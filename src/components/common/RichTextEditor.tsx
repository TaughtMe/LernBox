import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useState, useCallback, useEffect } from 'react';
import { Toolbar, BottomBar, type Cmd } from './Toolbar'; // Importiere deine neuen Komponenten

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
  // Dieser State hält die Information, welche Buttons gerade aktiv sind (z.B. 'bold': true)
  const [activeStates, setActiveStates] = useState<Partial<Record<Cmd, boolean>>>({});

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    // Diese Funktion wird bei JEDER Änderung im Editor aufgerufen
    onUpdate: ({ editor }) => {
      // 1. Gib den neuen Inhalt an die übergeordnete Komponente weiter
      onChange(editor.getHTML());

      // 2. Prüfe für jeden Button, ob er aktiv ist, und aktualisiere unseren State
      const active = {
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        strike: editor.isActive('strike'),
        bullet: editor.isActive('bulletList'),
        ordered: editor.isActive('orderedList'),
      };
      setActiveStates(active);
    },
  });

  // Diese Funktion dient als "Übersetzer" zwischen deinen UI-Buttons und Tiptap
  const handleExec = useCallback(
    (cmd: Cmd) => {
      if (!editor) return;
      const chain = editor.chain().focus();
      switch (cmd) {
        case 'bold':
          chain.toggleBold().run();
          break;
        case 'italic':
          chain.toggleItalic().run();
          break;
        case 'strike':
          chain.toggleStrike().run();
          break;
        case 'bullet':
          chain.toggleBulletList().run();
          break;
        case 'ordered':
          chain.toggleOrderedList().run();
          break;
      }
    },
    [editor]
  );
  
  // Synchronisiert den Editor-Inhalt, falls er von außen geändert wird
  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content, { emitUpdate: false })
    }
  }, [content, editor]);

  // Wichtig: Editor muss initialisiert sein
  if (!editor) {
    return null;
  }

  return (
    <div className="relative">
      {/* Desktop-Toolbar oben */}
      <Toolbar active={activeStates} onExec={handleExec} />

      {/* Editor-Fläche: hier die Tailwind-Styles statt .tiptap-content-area */}
      <div
        className="min-h-48 bg-slate-900/60 border border-white/10 rounded-xl p-3"
        style={{ lineHeight: 1.5 }}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Platzhalter, damit die Mobile BottomBar nichts überdeckt */}
      <div className="h-16 md:h-0" />

      {/* Mobile Bottom-Bar unten fixiert */}
      <BottomBar active={activeStates} onExec={handleExec} />
    </div>
  )

};

export default RichTextEditor;