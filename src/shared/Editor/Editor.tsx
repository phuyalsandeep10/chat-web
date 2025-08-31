'use client';

import { DropdownMenu } from '@/components/ui/dropdown-menu';
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
import { useEffect, useImperativeHandle, useRef, useState } from 'react';

// to disable the default enter behaivor from entering new line
// while shift+enter will still do the tricks😊
const DisableEnter = Extension.create({
  name: 'disableEnter',
  addKeyboardShortcuts() {
    return {
      Enter: () => true,
    };
  },
});

// submission on enter pressed
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
        // Safely call onSubmit
        if (typeof this.options.onSubmit === 'function') {
          Promise.resolve(this.options.onSubmit(this.editor)).then(() => {
            // this.editor.commands.clearContent();
          });
          console.log('inside if');
        }

        // Clear content after submit
        // setTimeout(() => {
        //   this.editor.commands.clearContent();
        // }, 0);

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
}: {
  value: string | null;
  onChange: (value: string) => void;
  onSubmit: (editor: any) => void;
  ref: any;
}) => {
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);
  const emojiBtnRef = useRef<HTMLButtonElement>(null);

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
      // DisableEnter, // <-- Remove this line
      Underline,
      Document,
      Paragraph,
      Strike,
      Text,
      Placeholder.configure({
        placeholder: 'Write your thought here....',
      }),
      SubmitOnEnter.configure({
        onSubmit: onSubmit, // Pass the editor instance
      }),
      BulletList,
      ListItem,
    ],
    // content: '<p></p>',
    immediatelyRender: false,
    autofocus: true,
    editable: true,
    injectCSS: true,
    content: value || undefined,

    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  useImperativeHandle(ref, () => {
    return {
      onClear: () => {
        editor?.commands.clearContent();
      },
    };
  }, [editor?.commands]);

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
    <div className="relative -mt-15 space-y-4 bg-white pt-2">
      <EditorContent
        className="overflow-y-auto rounded-2xl border-2 p-4 [&_.ProseMirror]:h-[70px] [&_.ProseMirror]:break-words [&_.ProseMirror]:whitespace-pre-wrap [&_.ProseMirror]:caret-black [&_.ProseMirror]:outline-none [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror:focus]:outline-none [&_.ProseMirror>.placeholder]:text-gray-400"
        editor={editor}
      />

      <div className="flex justify-between">
        {/* Left Controls */}
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
          {/* emoji picker */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button ref={emojiBtnRef} onClick={handleEmojiBtn}>
                <Smile />
              </button>
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
            onClick={() => {
              onSubmit(editor);
              // editor.commands.clearContent();
            }}
            className="flex items-center gap-1 rounded-[8px] border bg-[#7914ca] px-4 py-2 text-base font-semibold text-white"
            type="button"
          >
            Send{' '}
            <img
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
