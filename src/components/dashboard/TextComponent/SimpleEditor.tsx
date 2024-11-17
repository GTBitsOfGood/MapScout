import React, { useCallback, useState } from "react";
import classNames from "classnames";
import "./styles.css";
import { useEditor, EditorContent, Editor, BubbleMenu } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Link from "@tiptap/extension-link";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import History from "@tiptap/extension-history";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import * as Icons from "./Icons";
import { LinkModal } from "./LinkModal";
import CustomDropdown from "./CustomDropdown";
import { TextColor } from "./TextColor/TextColor";
import ColorPickerButton from "./TextColor/ColorPickerButton";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Image from "@tiptap/extension-image";
import Blockquote from "@tiptap/extension-blockquote";
import bqSVG from "../../../assets/svg/blockquote.svg"

interface EditorState {
  title: string;
  description: string;
};

export function SimpleEditor(
  { editorState, setEditorState, deleteComponent }:
    {
      editorState: EditorState;
      setEditorState: (newState: EditorState) => void;
      deleteComponent: () => void;
    }) {
  const CustomImage = Image.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        class: {
          default: "fixed-image", // Assign the CSS class here
        },
      };
    },
  });

  const editor = useEditor({
    extensions: [
      Document,
      // History,
      Paragraph,
      Text,
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      Link.configure({ openOnClick: false }),
      Bold,
      Underline,
      Italic,
      Strike,
      Code,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextColor,
      BulletList,
      ListItem,
      OrderedList,
      CustomImage,
      Blockquote
    ],
    content: editorState.description,
    onUpdate: ({ editor }) => {
      setEditorState({
        ...editorState,
        description: editor.getHTML()
      });
    }
  }) as Editor;

  const [modalIsOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState<string>("");

  const changeTextStyle = useCallback((value: string) => {
    editor.chain().focus().setParagraph().run();
    if (value === "heading1") {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    } else if (value === "heading2") {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    } else if (value === "heading3") {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
    }
  }, [editor]);

  const changeTextAlignment = useCallback((alignment: string) => {
    editor.chain().focus().setTextAlign(alignment).run();
  }, [editor]);

  const openModal = useCallback(() => {
    setUrl(editor.getAttributes("link").href);
    setIsOpen(true);
  }, [editor]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setUrl("");
  }, []);

  const saveLink = useCallback(() => {
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    closeModal();
  }, [editor, url, closeModal]);

  const removeLink = useCallback(() => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    closeModal();
  }, [editor, closeModal]);

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


  const addImage = useCallback(() => {
    const imageUrl: string | null = prompt("Enter the image URL");
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }


  return (
    <div className="editor" style={{width: "100%"}}>
      <BubbleMenu
        className="bubble-menu-light"
        tippyOptions={{ duration: 150 }}
        editor={editor}
        shouldShow={({ editor }) => editor.isActive("link")}
      >
        <button
          type="button"
          className="button"
          onClick={(event) => {
            event.preventDefault();
            openModal();
          }}
        >
          Edit
        </button>
        <button
          type="button"
          className="button-remove"
          onClick={(event) => {
            event.preventDefault();
            removeLink();
          }}
        >
          Remove
        </button>
      </BubbleMenu>

      <div className="inner-box" style={{ overflow: "scroll" }}>

        <div className="menu">
          {/* <button
            type="button"
            className="menu-button"
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().undo().run();
            }}
            disabled={!editor.can().undo()}
          >
            <Icons.RotateLeft />
          </button>

          <button
            type="button"
            className="menu-button"
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().redo().run();
            }}
            disabled={!editor.can().redo()}
          >
            <Icons.RotateRight />
          </button> */}

          <ColorPickerButton editor={editor} />

          <CustomDropdown
            onChange={changeTextStyle}
            options={[
              { label: "Normal text", value: "paragraph" },
              { label: "Heading 1", value: "heading1" },
              { label: "Heading 2", value: "heading2" },
              { label: "Heading 3", value: "heading3" },
            ]}
            defaultValue="paragraph"
            labelType="text"
          />

          <CustomDropdown
            onChange={changeTextAlignment}
            options={[
              { label: "Left", value: "left", icon: <Icons.AlignLeftIcon /> },
              { label: "Center", value: "center", icon: <Icons.AlignCenterIcon /> },
              { label: "Right", value: "right", icon: <Icons.AlignRightIcon /> },
              { label: "Justify", value: "justify", icon: <Icons.JustifyIcon /> },
            ]}
            defaultValue="left"
            labelType="icon"
          />

          <button
            type="button"
            className={classNames("menu-button", {
              "is-active": editor.isActive("bold"),
            })}
            onClick={(event) => {
              event.preventDefault();
              toggleBold();
            }}
          >
            <Icons.Bold />
          </button>

          <button
            type="button"
            className={classNames("menu-button", {
              "is-active": editor.isActive("italic"),
            })}
            onClick={(event) => {
              event.preventDefault();
              toggleItalic();
            }}
          >
            <Icons.Italic />
          </button>

          <button
            type="button"
            className={classNames("menu-button", {
              "is-active": editor.isActive("underline"),
            })}
            onClick={(event) => {
              event.preventDefault();
              toggleUnderline();
            }}
          >
            <Icons.Underline />
          </button>

          <button
            type="button"
            className={classNames("menu-button", {
              "is-active": editor.isActive("strike"),
            })}
            onClick={(event) => {
              event.preventDefault();
              toggleStrike();
            }}
          >
            <Icons.Strikethrough />
          </button>

          <button
            type="button"
            className={classNames("menu-button", {
              "is-active": editor.isActive("code"),
            })}
            onClick={(event) => {
              event.preventDefault();
              toggleCode();
            }}
          >
            <Icons.Code />
          </button>

          <button
            type="button"
            className={classNames("menu-button", {
              "is-active": editor.isActive("bulletList"),
            })}
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleBulletList().run();
            }}
          >
            <Icons.BulletListIcon />
          </button>

          <button
            type="button"
            className={classNames("menu-button", {
              "is-active": editor.isActive("orderedList"),
            })}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <Icons.NumberedListIcon />
          </button>

          <button
            type="button"
            className={classNames("menu-button", {
              "is-active": editor.isActive("link"),
            })}
            onClick={(event) => {
              event.preventDefault();
              openModal();
            }}
          >
            <Icons.Link />
          </button>

          <button
            type="button"
            className="menu-button"
            onClick={addImage}
          >
            <Icons.ImageIcon />
          </button>

          <button
            type="button"
            className={classNames("menu-button", {
              "is-active": editor.isActive("blockquote"),
            })}
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleBlockquote().run();
            }}
          >
            <img src={bqSVG} alt="Blockquote" style={{ width: 20, height: 20 }} />
          </button>

        </div>
        <EditorContent editor={editor} />
      </div>

      <LinkModal
        url={url}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Link Modal"
        closeModal={closeModal}
        onChangeUrl={(e) => setUrl(e.target.value)}
        onSaveLink={saveLink}
        onRemoveLink={removeLink}
      />

      <div
        style={{ display: "flex", justifyContent: "end", marginTop: "16px" }}
      >
        <button
          type="button"
          id="delete"
          style={{
            color: "red",
            border: "1px solid red",
            padding: "5px",
            borderRadius: "4px",
          }}
          onClick={deleteComponent}
        >
          Delete Component
        </button>
      </div>
    </div>
  );
}
