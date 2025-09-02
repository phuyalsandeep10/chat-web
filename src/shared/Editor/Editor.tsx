'use client';

import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { Extension } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import { BulletList, ListItem } from '@tiptap/extension-list';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import Strike from '@tiptap/extension-strike';
import Text from '@tiptap/extension-text';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import EmojiPicker from 'emoji-picker-react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Smile,
  UnderlineIcon,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';

// Submission on Enter pressed
const SubmitOnEnter = Extension.create({
  name: 'submitOnEnter',
  addOptions() {
    return {
      onSubmit: async () => {}, // Default no-op
    };
  },
  addKeyboardShortcuts() {
    return {
      Enter: () => {
        const text = this.editor.getText().trim(); // plain text without tags
        if (text.length > 0 && typeof this.options.onSubmit === 'function') {
          Promise.resolve(this.options.onSubmit(this.editor));
        }
        return true;
      },
      'Shift-Enter': () => false,
    };
  },
});

const Tiptap = ({
  value,
  onChange,
  onSubmit,
  ref,
  isSending,
}: {
  value: string | null;
  onChange: (value: string) => void;
  onSubmit: (editor: any) => void;
  ref: any;
  isSending: boolean;
}) => {
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);
  const emojiBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setTimeout(() => {
        if (
          emojiRef.current &&
          !emojiRef.current.contains(event.target as Node) &&
          emojiBtnRef.current &&
          !emojiBtnRef.current.contains(event.target as Node)
        ) {
          setIsEmojiOpen(false);
        }
      }, 0);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        listItem: false,
      }),
      Underline,
      Document,
      Paragraph,
      Strike,
      Text,
      Placeholder.configure({
        placeholder: 'Write your thought here....',
      }),
      SubmitOnEnter.configure({
        onSubmit: onSubmit,
      }),
      BulletList,
      ListItem,
    ],
    immediatelyRender: false,
    autofocus: true,
    editable: true,
    injectCSS: true,
    content: value || '<p></p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Sync editor content with value prop (only if not focused)
  useEffect(() => {
    if (
      editor &&
      value !== undefined &&
      value !== editor.getHTML() &&
      !editor.isFocused
    ) {
      console.log('Updating editor content:', value);
      editor.commands.setContent(value || '<p></p>');
    }
  }, [value, editor]);

  useImperativeHandle(
    ref,
    () => ({
      onClear: () => {
        if (editor) {
          console.log('Clearing editor content');
          editor.commands.clearContent();
          onChange('<p></p>');
        }
      },
    }),
    [editor, onChange],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target as Node) &&
        emojiBtnRef.current &&
        !emojiBtnRef.current.contains(event.target as Node)
      ) {
        setIsEmojiOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  const removeEmptyListItems = () => {
    const doc = editor.state.doc;
    const tr = editor.state.tr;
    doc.descendants((node, pos) => {
      if (node.type.name === 'listItem' && node.content.size === 0) {
        tr.delete(pos, pos + node.nodeSize);
      }
    });
    if (tr.docChanged) {
      editor.view.dispatch(tr);
    }
  };

  const handleEmojiBtn = () => {
    setIsEmojiOpen((prev) => !prev);
  };

  return (
    <div
      className={cn(
        `relative -mt-15 space-y-4 bg-white pt-2`,
        isSending && 'cursor-not-allowed',
      )}
    >
      <EditorContent
        className="overflow-y-auto rounded-2xl border-2 p-4 text-wrap [&_.ProseMirror]:h-[70px] [&_.ProseMirror]:break-all [&_.ProseMirror]:whitespace-pre-wrap [&_.ProseMirror]:caret-black [&_.ProseMirror]:outline-none [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror:focus]:outline-none [&_.ProseMirror>.placeholder]:text-gray-400"
        editor={editor}
      />

      <div className="flex justify-between">
        <div className="flex gap-[6px]">
          <button
            className="rounded-md p-1 transition-all hover:scale-105 active:scale-90"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold />
          </button>
          <button
            className="rounded-md p-1 transition-all hover:scale-105 active:scale-90"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic />
          </button>
          <button
            className="rounded-md p-1 transition-all hover:scale-105 active:scale-90"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon />
          </button>
          <button
            onClick={() => {
              const isInBulletList = editor.isActive('bulletList');
              if (isInBulletList) {
                editor.chain().focus().setParagraph().run();
                removeEmptyListItems();
              } else {
                editor.chain().focus().toggleBulletList().run();
              }
            }}
            className={`rounded-md p-1 transition-all hover:scale-105 active:scale-90 ${
              editor.isActive('bulletList') ? 'is-active' : ''
            }`}
          >
            <List />
          </button>
          <button
            onClick={() => {
              const isInOrderedList = editor.isActive('orderedList');
              if (isInOrderedList) {
                editor.chain().focus().setParagraph().run();
                removeEmptyListItems();
              } else {
                editor.chain().focus().toggleOrderedList().run();
              }
            }}
            className={`rounded-md p-1 transition-all hover:scale-105 active:scale-90 ${
              editor.isActive('orderedList') ? 'bg-blue-200 text-white' : ''
            }`}
          >
            <ListOrdered />
          </button>
          <button
            className="rounded-md p-1 transition-all hover:scale-105 active:scale-90"
            onClick={() => {
              const { state, view } = editor;
              const { from, to } = state.selection;
              const selectedText = state.doc.textBetween(from, to, ' ');
              if (!selectedText) return;
              let newText = selectedText;
              const isQuoted =
                (selectedText.startsWith('"') && selectedText.endsWith('"')) ||
                (selectedText.startsWith('“') && selectedText.endsWith('”'));
              if (isQuoted) {
                newText = selectedText.slice(1, -1);
              } else {
                newText = `"${selectedText}"`;
              }
              view.dispatch(state.tr.insertText(newText, from, to));
              view.focus();
            }}
          >
            <Quote />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div ref={emojiBtnRef} onClick={handleEmojiBtn}>
                <Smile />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <EmojiPicker
                className="m-4 shadow-sm"
                onEmojiClick={(emojiData) => {
                  editor.chain().focus().insertContent(emojiData.emoji).run();
                  setIsEmojiOpen(false);
                }}
              />
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            disabled={isSending}
            onClick={() => {
              const text = editor.getText().trim();
              if (text.length > 0) {
                onSubmit(editor);
              }
              // editor.commands.clearContent();
            }}
            className={cn(
              `flex items-center gap-1 rounded-[8px] border bg-[#7914ca] px-4 py-2 text-base font-semibold text-white`,
              isSending && 'bg-secondary-disabled cursor-wait',
            )}
            type="button"
          >
            Send{' '}
            <Image
              src="/inbox/send-plane-line.svg"
              alt="send icon"
              width={18}
              height={100}
              className="h-6 text-white"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tiptap;
