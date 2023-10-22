import { MainComment } from "@/types/types";
import SectionCommentReply from "./SectionCommentReply";
import { Editor } from "@tiptap/react";
export default function SectionComment({
  comment,
  editor,
  prompt,
}: {
  comment: MainComment;
  editor: Editor | null;
  prompt: string;
}) {
  return (
    <div className="dark:bg-gray-800 bg-gray-100 text-black p-2 rounded-md grid gap-2 w-full">
      <SectionCommentReply
        commentHistory={comment}
        subComment={comment}
        editor={editor}
        prompt={prompt}
      ></SectionCommentReply>
    </div>
  );
}
