'use client';

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
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
  Underline as UnderlineIcon,
} from 'lucide-react';
import Image from 'next/image';

// Props type
type TiptapProps = {
  value: string | null;
  onChange: (value: string) => void;
  onSubmit: (
    editor: any,
    isEditing?: boolean,
    messageId?: string | null,
  ) => Promise<void> | void;
  isEditing?: boolean;
  messageId?: string | null;
};

const Editor = forwardRef<any, TiptapProps>(
  ({ value, onChange, onSubmit, isEditing, messageId }, ref) => {
    const internalEditorRef = useRef<any>(null);

    const SubmitOnEnter = Extension.create({
      name: 'submitOnEnter',
      addKeyboardShortcuts() {
        return {
          Enter: () => {
            const text = this.editor.getText().trim();
            if (!text) return false;

            try {
              const handler = submitHandlerRef.current;
              handler(this.editor, isEditingRef.current);
            } catch (e) {
              console.error('submitOnEnter error', e);
            }
            return true; // prevent newline
          },
          'Shift-Enter': () => false,
        };
      },
    });

    const [isEmojiOpen, setIsEmojiOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    //for active status of button
    const [selectedButton, setSelectedButton] = useState<number[]>([]);
    const emojiRef = useRef<HTMLDivElement | null>(null);
    const emojiBtnRef = useRef<HTMLDivElement | null>(null);
    const lastValueRef = useRef<string | null>(null);

    const isEditingRef = useRef<boolean>(isEditing);
    const submitHandlerRef = useRef<
      (editor: any, editing?: boolean) => Promise<void> | void
    >(() => {});

    useEffect(() => {
      isEditingRef.current = isEditing;
    }, [isEditing]);

    useEffect(() => {
      submitHandlerRef.current = async (editor: any, editing = false) => {
        await handleSubmit(editor, editing);
      };
    }, []);

    // click outside for emoji dropdown
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
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // handleUpdate for onChange
    const handleUpdate = useCallback(
      ({ editor }: any) => {
        if (isSubmitting) return;
        const html = editor.getHTML();
        if (html !== lastValueRef.current) {
          lastValueRef.current = html;
          onChange(html);
        }
      },
      [onChange, isSubmitting],
    );

    const handleSubmit = useCallback(
      async (editor: any, editing = false) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
          await onSubmit(editor, editing, messageId);

          if (!editing) {
            editor.commands.clearContent();
            lastValueRef.current = '<p></p>';
            // ✅ removed onChange('<p></p>') to prevent fake typing animation
          }
        } finally {
          setIsSubmitting(false);
        }
      },
      [onSubmit, isSubmitting, messageId],
    );

    useEffect(() => {
      submitHandlerRef.current = handleSubmit;
    }, [handleSubmit]);

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
          placeholder: isEditing
            ? 'Edit your message...'
            : 'Write your thought here....',
        }),
        SubmitOnEnter,
        BulletList,
        ListItem,
      ],
      immediatelyRender: false,
      autofocus: 'end',
      editable: true,
      injectCSS: true,
      content: value || '<p></p>',
      onUpdate: handleUpdate,
    });

    // Sync external value -> editor
    useEffect(() => {
      if (
        editor &&
        value !== undefined &&
        value !== lastValueRef.current &&
        !editor.isFocused &&
        !isSubmitting
      ) {
        lastValueRef.current = value;
        editor.commands.setContent(value || '<p></p>');
      }
    }, [value, editor, isSubmitting]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        internalEditorRef.current?.commands.focus();
      },
      onClear: () => {
        internalEditorRef.current?.commands.clearContent();
      },
    }));
    internalEditorRef.current = editor;

    const removeEmptyListItems = () => {
      if (!editor) return;
      const doc = editor.state.doc;
      const tr = editor.state.tr;
      doc.descendants((node: any, pos: number) => {
        if (node.type.name === 'listItem' && node.content.size === 0) {
          tr.delete(pos, pos + node.nodeSize);
        }
      });
      if (tr.docChanged) editor.view.dispatch(tr);
    };

    const handleEmojiBtn = () => setIsEmojiOpen((s) => !s);

    const handleSendClick = async () => {
      if (!editor) return;
      const text = editor.getText().trim();
      if (text.length > 0 && !isSubmitting) {
        await handleSubmit(editor, isEditingRef.current);
      }
    };

    if (!editor) return <div>Loading editor...</div>;

    // handle button selections
    const handleButtonSelection = (id: number) => {
      setSelectedButton((prev) => {
        if (prev.includes(id)) {
          return prev.filter((btnId) => btnId !== id);
        } else {
          return [...prev, id];
        }
      });

      console.log(selectedButton);
    };

    return (
      <div className="relative space-y-4 bg-white">
        <EditorContent
          className="overflow-y-auto rounded-2xl border-2 p-4 text-wrap [&_.ProseMirror]:h-[70px] [&_.ProseMirror]:break-all [&_.ProseMirror]:whitespace-pre-wrap [&_.ProseMirror]:caret-black [&_.ProseMirror]:outline-none [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror:focus]:outline-none [&_.ProseMirror>.placeholder]:text-gray-400"
          editor={editor}
        />

        <div className="flex justify-between">
          {/* Formatting Buttons */}
          <div className="flex gap-[6px]">
            <button
              className={`${selectedButton.includes(1) ? 'bg-brand-primary text-white' : ''} rounded-md p-1 transition-all hover:scale-105 active:scale-90`}
              onClick={() => {
                handleButtonSelection(1);
                editor.chain().focus().toggleBold().run();
              }}
              disabled={isSubmitting}
            >
              <Bold className={``} />
            </button>

            <button
              className={`${selectedButton.includes(2) ? 'bg-brand-primary text-white' : ''} rounded-md p-1 transition-all hover:scale-105 active:scale-90`}
              onClick={() => {
                handleButtonSelection(2);
                editor.chain().focus().toggleItalic().run();
              }}
              disabled={isSubmitting}
            >
              <Italic />
            </button>

            <button
              className={`${selectedButton.includes(3) ? 'bg-brand-primary text-white' : ''} rounded-md p-1 transition-all hover:scale-105 active:scale-90`}
              onClick={() => {
                handleButtonSelection(3);
                editor.chain().focus().toggleUnderline().run();
              }}
              disabled={isSubmitting}
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
                editor.isActive('bulletList')
                  ? 'is-active bg-brand-primary text-white'
                  : ''
              }`}
              disabled={isSubmitting}
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
                editor.isActive('orderedList')
                  ? 'bg-brand-primary text-white'
                  : ''
              }`}
              disabled={isSubmitting}
            >
              <ListOrdered />
            </button>

            <button
              className={`active:bg-brand-primary rounded-md p-1 transition-all hover:scale-105 active:scale-90 active:text-white`}
              onClick={() => {
                const { state, view } = editor;
                const { from, to } = state.selection;
                const selectedText = state.doc.textBetween(from, to, ' ');
                if (!selectedText) return;
                let newText = selectedText;
                const isQuoted =
                  (selectedText.startsWith('"') &&
                    selectedText.endsWith('"')) ||
                  (selectedText.startsWith("'") && selectedText.endsWith("'"));
                if (isQuoted) {
                  newText = selectedText.slice(1, -1);
                } else {
                  newText = `"${selectedText}"`;
                }
                view.dispatch(state.tr.insertText(newText, from, to));
                view.focus();
              }}
              disabled={isSubmitting}
            >
              <Quote />
            </button>
          </div>

          {/* Emoji + Send */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div ref={emojiBtnRef} onClick={handleEmojiBtn}>
                  <Smile />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div ref={emojiRef}>
                  <EmojiPicker
                    className="m-4 shadow-sm"
                    onEmojiClick={(emojiData) => {
                      editor
                        .chain()
                        .focus()
                        .insertContent(emojiData.emoji)
                        .run();
                      setIsEmojiOpen(false);
                    }}
                  />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={handleSendClick}
              className={`flex items-center gap-1 rounded-[8px] border px-4 py-2 text-base font-semibold text-white ${
                isSubmitting
                  ? 'cursor-not-allowed bg-gray-400'
                  : 'bg-[#7914ca] hover:bg-[#6a0fb8]'
              }`}
              type="button"
              disabled={isSubmitting}
            >
              {isEditing ? 'Update' : 'Send'}{' '}
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
  },
);

Editor.displayName = 'Editor';

export default Editor;
