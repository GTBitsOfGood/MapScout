// import React, { useEffect } from 'react';
// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
// import Toolbar from './Toolbar';

// interface TiptapProps {
//   content: string;
//   onChange: (newContent: string) => void;
// }

// const TiptapEditor: React.FC<TiptapProps> = ({ content, onChange }) => {
//   const editor = useEditor({
//     extensions: [StarterKit, Underline],
//     content: content,  // Initial content passed as prop
//     editorProps: {
//       attributes: {
//         class:
//           'flex flex-col px-4 py-3 justify-start border-b border-r border-l border-gray-700 text-gray-400 items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-bl-md rounded-br-md outline-none',
//       },
//     },
//     onUpdate: ({ editor }) => {
//       onChange(editor.getHTML());  // Call the parent onChange prop with the updated HTML
//     },
//   });

//   // Ensure the editor content updates if the content prop changes
//   useEffect(() => {
//     if (editor) {
//       editor.commands.setContent(content);
//     }
//   }, [content, editor]);

//   return (
//     <div className="w-full px-4">
//       {/* Pass editor instance to the Toolbar */}
//       <Toolbar editor={editor} content={content} />
//       <EditorContent editor={editor} />
//     </div>
//   );
// };

// export default TiptapEditor;
