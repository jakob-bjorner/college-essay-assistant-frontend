import { BubbleMenu, Editor } from "@tiptap/react";

export default function CustomBubbleMenu(props: { editor: Editor | null }) {
  const setBold = () => props.editor?.chain().focus().toggleBold().run();
  const setItalic = () => props.editor?.chain().focus().toggleItalic().run();

  const btnStyle = "border border-black rounded p-2";

  return (
    <>
      {props.editor ? (
        <BubbleMenu editor={props.editor} className="flex gap-1">
          <button onClick={setBold} className={btnStyle}>
            <strong>Bold</strong>
          </button>
          <button onClick={setItalic} className={btnStyle}>
            <em>Italic</em>
          </button>
        </BubbleMenu>
      ) : undefined}
    </>
  );
}
