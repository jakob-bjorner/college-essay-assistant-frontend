import { Editor } from "@tiptap/react";
import axios from "axios";
import { MainComment } from "@/types/types";
import { useState } from "react";
import ThemeButtons from "@/components/ThemeButtons";

export default function Toolbar(props: {
  editor: Editor | null;
  setComments: React.Dispatch<React.SetStateAction<MainComment[]>>;
  comments: MainComment[];
  prompt: string;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
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

  const setComment = async () => {
    props.setIsLoading(true);

    try {
      const selection = window.getSelection();
      if (selection === null || selection.toString().trim() === "") {
        throw new Error("No text selected for comment.");
      }

      const textSelected = selection.toString();
      const commentId = "ID:" + new Date().toISOString();
      const commentText = "filler text for now";

      props.editor?.chain().focus().setComment(commentText, commentId).run();

      const comment: MainComment = {
        id: commentId,
        text: commentText,
        author: "AI",
        timestamp: new Date(),
        essaySectionReference: textSelected,
        versionOfEssay: props.editor?.getText() || "",
      };

      // Simulate an API call delay with setTimeout
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      const newComment = await populateCommentText(comment);
      props.setComments([...props.comments, newComment]);
      props.setIsLoading(false);
    } catch (error) {
      props.setIsLoading(false);
      console.error("Error while setting a comment:", error);
    }
  };

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const populateCommentText = async (comment: MainComment) => {
    const selectedText = comment.essaySectionReference;

    if (!selectedText || !props.editor?.getText()) {
      console.error("Selected text or editor content is missing.");
      return {
        ...comment,
        text: "ERROR: No text selected.",
      };
    }
    try {
      const response = await axios({
        method: "post",
        url: "/backend/bot/feedback",
        data: {
          full_essay: props.editor?.getText(),
          section_to_review: selectedText,
          prompt: props.prompt,
        },
      });

      return {
        ...comment,
        text: response.data,
      };
    } catch (error) {
      console.error("Error while fetching comment response:", error);
      return {
        ...comment,
        text: "Error fetching comment response.",
      };
    }
  };

  return (
    <div className="flex flex-row border-2 border-box p-2 md:p-4 m-2 rounded-lg bg-box space-x-4">
      <button
        onClick={undo}
        className="text-black rounded p-3 md:p-4 hover:bg-gray-200 text-2xl"
      >
        {" "}
        {String.fromCodePoint(0x238c)}
      </button>
      <button
        onClick={setBold}
        className="text-black rounded p-3 md:p-4 hover-bg-gray-200 text-2xl"
      >
        <b>B</b>
      </button>
      <button
        onClick={setStrikethrough}
        className="text-black rounded p-3 md:p-4 hover-bg-gray-200 text-2xl"
      >
        <s>S</s>
      </button>
      <button
        onClick={setItalic}
        className="text-black rounded p-3 md:p-4 hover-bg-gray-200 text-2xl"
      >
        <i>I</i>
      </button>
      <button
        onClick={setUnderline}
        className="text-black rounded p-3 md:p-4 hover-bg-gray-200 text-2xl"
      >
        <span className="underline">U</span>
      </button>
      <button
        onClick={setComment}
        className="text-black rounded p-3 md:p-4 hover-bg-gray-200 text-2xl"
      >
        {props.isLoading ? (
          // Show a loading wheel when isLoading is true
          <div className="loader"></div>
        ) : (
          String.fromCodePoint(0x0001f5e8)
        )}
      </button>
      <div className="rounded-md p-2 md:p-3 hover-bg-gray-700">
        <ThemeButtons />
      </div>
    </div>
  );
}
