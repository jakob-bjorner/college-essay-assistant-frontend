import { MainComment } from "@/types/types";
import SectionCommentReply from "./SectionCommentReply";
import { Editor } from "@tiptap/react";
import { Socket } from "socket.io-client";
export default function SectionComment(props: {
  comment: MainComment;
  editor: Editor | null;
  prompt: string;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  socket: Socket;
}) {
  // console.log("INSIDE section Comment", comment);
  const { comment, editor, prompt, isLoading, setIsLoading, socket } = props;
  return (
    <div className="dark:bg-gray-800 bg-gray-100 text-black p-2 rounded-md grid gap-2 w-full">
      <SectionCommentReply
        commentHistory={comment}
        subComment={comment}
        editor={editor}
        prompt={prompt}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        socket={socket}
      ></SectionCommentReply>
    </div>
  );
}
