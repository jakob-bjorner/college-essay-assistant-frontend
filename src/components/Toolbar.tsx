import { Editor } from "@tiptap/react";
import axios from "axios";
import { CommentInterface, MainComment } from "@/types/types";
import ThemeButtons from "@/components/ThemeButtons";

export default function Toolbar(props: {
  editor: Editor | null;
  setComments: React.Dispatch<React.SetStateAction<MainComment[]>>;
  comments: MainComment[];
  prompt: string;
}) {
  const setBold = () => {
    props.editor?.chain().focus().toggleBold().run();
  };

  const setStrikethrough = () => {
    props.editor?.chain().focus().toggleStrike().run();
  };

  const setItalic = () => {
    props.editor?.chain().focus().toggleItalic().run();
  };

  const setUnderline = () => {
    props.editor?.chain().focus().toggleUnderline().run();
  };

  const undo = () => {
    props.editor?.chain().undo().run();
  };

  const setComment = () => {
    const selection = window.getSelection();
    if (selection === null) {
      throw new Error("no text selected error on comment");
    }
    const textSelected = selection.toString();
    const commentId = "ID:" + new Date().toISOString();
    const commentText = "filler text for now";
    props.editor
      ?.chain()
      .focus()
      .setComment("filler text for now", commentId)
      .run();
    const comment: MainComment = {
      id: commentId,
      text: commentText,
      author: "AI",
      timestamp: new Date(),
      essaySectionReference: textSelected,
      versionOfEssay: props.editor?.getText() || "",
    };

    populateCommentText(comment);
  };

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const populateCommentText = async (comment: MainComment) => {
    const selectedText = comment.essaySectionReference;

    const commentResponse = async () => {
      if (selectedText && props.editor?.getText()) {
        return await axios({
          method: "post",
          url: "/backend/bot/feedback",
          data: {
            full_essay: props.editor?.getText(),
            section_to_review: selectedText,
            prompt: props.prompt,
          },
        }).then((response) => {
          return response.data;
        });
      } else {
        console.log(
          "selected text ERROR",
          selectedText,
          props.editor?.getText(),
        );
        return "ERROR: No text selected.";
      }
    };

    const newComment: MainComment = {
      ...comment,
      text: await commentResponse(),
    };
    console.log(props.comments);
    props.setComments([...props.comments, newComment]);
    console.log(newComment);
    return newComment;
  };

  return (
    <div className="flex flex-row border-2 border-box p-2 md:p-4 m-2 rounded-lg bg-box space-x-4">
      {" "}
      {/* Increased spacing */}
      <button
        onClick={undo}
        className="text-black rounded p-3 md:p-4 hover:bg-gray-200 text-2xl"
      >
        {" "}
        {String.fromCodePoint(0x238c)}
      </button>
      <button
        onClick={setBold}
        className="text-black rounded p-3 md:p-4 hover:bg-gray-200 text-2xl"
      >
        {" "}
        {/* Changed text color to black */}
        <b>B</b>
      </button>
      <button
        onClick={setStrikethrough}
        className="text-black rounded p-3 md:p-4 hover-bg-gray-200 text-2xl"
      >
        {" "}
        {/* Changed text color to black */}
        <s>S</s>
      </button>
      <button
        onClick={setItalic}
        className="text-black rounded p-3 md:p-4 hover:bg-gray-200 text-2xl"
      >
        {" "}
        {/* Changed text color to black */}
        <i>I</i>
      </button>
      <button
        onClick={setUnderline}
        className="text-black rounded p-3 md:p-4 hover:bg-gray-200 text-2xl"
      >
        {" "}
        {/* Changed text color to black */}
        <span className="underline">U</span>
      </button>
      <button
        onClick={setComment}
        className="text-black rounded p-3 md:p-4 hover:bg-gray-200 text-2xl"
      >
        {" "}
        {/* Changed text color to black */}
        {String.fromCodePoint(0x0001f5e8)}
      </button>
      <div className="rounded-md p-2 md:p-3 hover:bg-gray-700">
        <ThemeButtons />
      </div>
    </div>
  );
}
