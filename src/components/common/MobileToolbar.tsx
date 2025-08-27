import { type Editor } from '@tiptap/react';
import React from 'react';
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaListUl,
  FaListOl,
} from 'react-icons/fa6';
import { IconToggle } from './IconToggle';

interface MobileToolbarProps {
  editor: Editor | null;
}

export const MobileToolbar: React.FC<MobileToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  // Configuration for our toolbar buttons
  const controls = [
    {
      name: 'bold',
      icon: <FaBold size={20} />,
      action: () => editor.chain().focus().toggleBold().run(),
      disabled: !editor.can().chain().focus().toggleBold().run(),
      ariaLabel: 'Bold',
    },
    {
      name: 'italic',
      icon: <FaItalic size={20} />,
      action: () => editor.chain().focus().toggleItalic().run(),
      disabled: !editor.can().chain().focus().toggleItalic().run(),
      ariaLabel: 'Italic',
    },
    {
      name: 'strike',
      icon: <FaStrikethrough size={20} />,
      action: () => editor.chain().focus().toggleStrike().run(),
      disabled: !editor.can().chain().focus().toggleStrike().run(),
      ariaLabel: 'Strikethrough',
    },
    {
      name: 'bulletList',
      icon: <FaListUl size={20} />,
      action: () => editor.chain().focus().toggleBulletList().run(),
      disabled: false, // Lists can always be toggled
      ariaLabel: 'Bullet List',
    },
    {
      name: 'orderedList',
      icon: <FaListOl size={20} />,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      disabled: false,
      ariaLabel: 'Ordered List',
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-gray-900/70 backdrop-blur-sm p-2 z-20">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {controls.map((control) => (
          <IconToggle
            key={control.name}
            onClick={control.action}
            disabled={control.disabled}
            isActive={editor.isActive(control.name)}
            ariaLabel={control.ariaLabel}
          >
            {control.icon}
          </IconToggle>
        ))}
      </div>
    </nav>
  );
};