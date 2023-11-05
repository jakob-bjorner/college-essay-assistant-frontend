import { Editor } from "@tiptap/react";
import axios from "axios";
import { MainComment } from "@/types/types";
import { useState } from "react";
import ThemeButtons from "@/components/ThemeButtons";
import { updateAttributes } from "@tiptap/core/dist/packages/core/src/commands";
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

      const [currComment, setCurrComment] = useState<MainComment>({
        id: commentId,
        text: commentText,
        author: "AI",
        timestamp: new Date(),
        essaySectionReference: textSelected,
        versionOfEssay: props.editor?.getText() || "",
      });

      const commentHistoryArray = [
        {
          role: "user",
          content: `Version of Essay: \`\`\`${currComment.versionOfEssay}\`\`\`\nSection to Review: \`\`\`${currComment.essaySectionReference}\`\`\``,
        },
      ];

      const aiResponse = await axios({
        method: "post",
        url: "http://127.0.0.1:5000/v2/bot/feedback",
        data: {
          full_essay: props.editor?.getText(),
          section_to_review: textSelected,
          comment_history: commentHistoryArray,
          prompt: props.prompt,
        }
      }).then((response) => {
        return response.data;
      });
      const reader = aiResponse.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let partial = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break
        }
        partial += decoder.decode(value)
        console.log(partial);
        setCurrComment({...currComment, text: aiResponse});
      }

      props.setComments([...props.comments, currComment]);
      props.setIsLoading(false);
    } catch (error) {
      props.setIsLoading(false);
      console.error("Error while setting a comment:", error);
    }
  }


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
