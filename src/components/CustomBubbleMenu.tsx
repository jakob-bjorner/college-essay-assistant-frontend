import { BubbleMenu, Editor } from "@tiptap/react";

export default function CustomBubbleMenu(props: { editor: Editor | null }) {
  const setBold = () => props.editor?.chain().focus().toggleBold().run();
  const setItalic = () => props.editor?.chain().focus().toggleItalic().run();

  const style = (mark: string) => "border border-black rounded p-2";

  return (
    <>
      {props.editor ? (
        <BubbleMenu editor={props.editor}>
          <button onClick={setBold} className={style("bold")}>
            Bold
          </button>
        </BubbleMenu>
      ) : undefined}
    </>
  );
}
