// import React, { useCallback, useState } from "react";
// import classNames from "classnames";
// // => Tiptap packages
// import { useEditor, EditorContent, Editor, BubbleMenu } from "@tiptap/react";
// import Document from "@tiptap/extension-document";
// import Paragraph from "@tiptap/extension-paragraph";
// import Text from "@tiptap/extension-text";
// import Link from "@tiptap/extension-link";
// import Bold from "@tiptap/extension-bold";
// import Underline from "@tiptap/extension-underline";
// import Italic from "@tiptap/extension-italic";
// import Strike from "@tiptap/extension-strike";
// import Code from "@tiptap/extension-code";
// import History from "@tiptap/extension-history";
// // Custom
// import content from "./content";
// import * as Icons from "./Icons";
// import { LinkModal } from "./LinkModal";

// export function SimpleEditor() {
//   const editor = useEditor({
//     extensions: [
//       Document,
//       History,
//       Paragraph,
//       Text,
//       Link.configure({
//         openOnClick: false
//       }),
//       Bold,
//       Underline,
//       Italic,
//       Strike,
//       Code
//     ],
//     content
//   }) as Editor;
//   const [modalIsOpen, setIsOpen] = useState(false);
//   const [url, setUrl] = useState<string>("");

//   const openModal = useCallback(() => {
//     console.log(editor.chain().focus());
//     setUrl(editor.getAttributes("link").href);
//     setIsOpen(true);
//   }, [editor]);

//   const closeModal = useCallback(() => {
//     setIsOpen(false);
//     setUrl("");
//   }, []);

//   const saveLink = useCallback(() => {
//     if (url) {
//       editor
//         .chain()
//         .focus()
//         .extendMarkRange("link")
//         .setLink({ href: url, target: "_blank" })
//         .run();
//     } else {
//       editor.chain().focus().extendMarkRange("link").unsetLink().run();
//     }
//     closeModal();
//   }, [editor, url, closeModal]);

//   const removeLink = useCallback(() => {
//     editor.chain().focus().extendMarkRange("link").unsetLink().run();
//     closeModal();
//   }, [editor, closeModal]);

//   const toggleBold = useCallback(() => {
//     editor.chain().focus().toggleBold().run();
//   }, [editor]);

//   const toggleUnderline = useCallback(() => {
//     editor.chain().focus().toggleUnderline().run();
//   }, [editor]);

//   const toggleItalic = useCallback(() => {
//     editor.chain().focus().toggleItalic().run();
//   }, [editor]);

//   const toggleStrike = useCallback(() => {
//     editor.chain().focus().toggleStrike().run();
//   }, [editor]);

//   const toggleCode = useCallback(() => {
//     editor.chain().focus().toggleCode().run();
//   }, [editor]);

//   if (!editor) {
//     return null;
//   }

//   return (
//     <div className="editor">
//       <div className="menu">
//         <button
//           className="menu-button"
//           onClick={() => editor.chain().focus().undo().run()}
//           disabled={!editor.can().undo()}
//         >
//           <Icons.RotateLeft />
//         </button>
//         <button
//           className="menu-button"
//           onClick={() => editor.chain().focus().redo().run()}
//           disabled={!editor.can().redo()}
//         >
//           <Icons.RotateRight />
//         </button>
//         {/* <button
//           className={classNames("menu-button", {
//             "is-active": editor.isActive("link")
//           })}
//           onClick={openModal}
//         >
//           <Icons.Link />
//         </button> */}
//         <button
//           className={classNames("menu-button", {
//             "is-active": editor.isActive("bold")
//           })}
//           onClick={toggleBold}
//         >
//           <Icons.Bold />
//         </button>
//         <button
//           className={classNames("menu-button", {
//             "is-active": editor.isActive("underline")
//           })}
//           onClick={toggleUnderline}
//         >
//           <Icons.Underline />
//         </button>
//         <button
//           className={classNames("menu-button", {
//             "is-active": editor.isActive("intalic")
//           })}
//           onClick={toggleItalic}
//         >
//           <Icons.Italic />
//         </button>
//         <button
//           className={classNames("menu-button", {
//             "is-active": editor.isActive("strike")
//           })}
//           onClick={toggleStrike}
//         >
//           <Icons.Strikethrough />
//         </button>
//         <button
//           className={classNames("menu-button", {
//             "is-active": editor.isActive("code")
//           })}
//           onClick={toggleCode}
//         >
//           <Icons.Code />
//         </button>
//       </div>

//       <EditorContent editor={editor} />

//       {/* <LinkModal
//         url={url}
//         isOpen={modalIsOpen}
//         onRequestClose={closeModal}
//         contentLabel="Edit Link Modal"
//         closeModal={closeModal}
//         onChangeUrl={(e) => setUrl(e.target.value)}
//         onSaveLink={saveLink}
//         onRemoveLink={removeLink}
//       /> */}    
//     </div>
//   );
// }
