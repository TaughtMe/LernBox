import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect } from 'react';
import { Toolbar } from './Toolbar';
import { MobileToolbar } from './MobileToolbar'; // Import the new mobile toolbar
import { useMediaQuery } from '../../hooks/useMediaQuery'; // Import the responsive hook

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
  // Check if the screen width is 768px or less
  const isMobile = useMediaQuery('(max-width: 768px)');

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
    const isSame = editor?.getHTML() === content;
    if (isSame) {
      return;
    }
    editor?.commands.setContent(content, { emitUpdate: false });
  }, [content, editor]);

  return (
    <div className="tiptap-editor">
      {/* Conditionally render the correct toolbar based on screen size */}
      {isMobile ? (
        <MobileToolbar editor={editor} />
      ) : (
        <Toolbar editor={editor} />
      )}
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;