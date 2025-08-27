import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect } from 'react';
import { Toolbar } from './Toolbar';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {},
    },
  });

  useEffect(() => {
    // A race condition can happen where the editor updates the parent,
    // which then re-renders and tries to set the content back, causing a loop.
    // This check prevents that.
    const isSame = editor?.getHTML() === content;

    if (isSame) {
      return;
    }
    
    // KORRIGIERTE ZEILE:
    // The second argument is now an object instead of a boolean.
    editor?.commands.setContent(content, { emitUpdate: false });

  }, [content, editor]);

  return (
    <div className="tiptap-editor">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;