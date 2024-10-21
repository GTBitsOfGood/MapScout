import React, { useCallback, useState, useEffect } from "react";
import classNames from "classnames";
// => Tiptap packages
import { useEditor, EditorContent, Editor, BubbleMenu } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import History from "@tiptap/extension-history";
import Collapsible from "components/collapsible"; 
import styles from "./TextComponent.module.css";

// Custom Icons
import * as Icons from "./Icons";

interface TextComponentProps {
  content: string;
  onContentUpdate: (updatedContent: string) => void;
}

export function TextComponent({ content, onContentUpdate }: TextComponentProps) {
  const editor = useEditor({
    extensions: [
      Document,
      History,
      Paragraph,
      Text,
      Bold,
      Underline,
      Italic,
      Strike,
      Code
    ],
    content: content, // Use content from props
  }) as Editor;

  // Handle content updates
  useEffect(() => {
    if (editor) {
      editor.on("update", () => {
        const updatedContent = editor.getHTML();
        onContentUpdate(updatedContent);
      });
    }
  }, [editor, onContentUpdate]);

  const toggleBold = useCallback(() => {
    editor.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor.chain().focus().toggleUnderline().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor.chain().focus().toggleStrike().run();
  }, [editor]);

  const toggleCode = useCallback(() => {
    editor.chain().focus().toggleCode().run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <Collapsible label="Text"> 
      <label className={styles.textLabel}>Text</label>
      <div className={styles.editor}>
        <div className={styles.menu}>
          <button
            className={styles.menuButton}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Icons.RotateLeft />
          </button>
          <button
            className={styles.menuButton}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Icons.RotateRight />
          </button>
          <button
            className={classNames(styles.menuButton, {
              [styles['is-active']]: editor.isActive("bold"),
            })}
            onClick={toggleBold}
          >
            <Icons.Bold />
          </button>
          
          <button
            className={classNames(styles.menuButton, {
              [styles['is-active']]: editor.isActive("italic"),
            })}
            onClick={toggleItalic}
          >
            <Icons.Italic />
          </button>

          <button
            className={classNames(styles.menuButton, {
              [styles['is-active']]: editor.isActive("underline"),
            })}
            onClick={toggleUnderline}
          >
            <Icons.Underline />
          </button>
          
          <button
            className={classNames(styles.menuButton, {
              [styles['is-active']]: editor.isActive("strike"),
            })}
            onClick={toggleStrike}
          >
            <Icons.Strikethrough />
          </button>
          <button
            className={classNames(styles.menuButton, {
              [styles['is-active']]: editor.isActive("code"),
            })}
            onClick={toggleCode}
          >
            <Icons.Code />
          </button>
        </div>

        <div className={styles.editorContentWrapper}>
          <EditorContent className={styles.content} editor={editor} />
        </div>
      </div>
      <label className={styles.deleteLabel}>Delete</label>
    </Collapsible>
  );
}
