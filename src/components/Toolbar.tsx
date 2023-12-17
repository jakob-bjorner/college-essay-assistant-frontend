import { Editor } from "@tiptap/react";
import axios from "axios";
import { MainComment } from "@/types/types";
import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import ThemeButtons from "@/components/ThemeButtons";
import io from "socket.io-client";
import { updateAttributes } from "@tiptap/core/dist/packages/core/src/commands";
export default function Toolbar(props: {
  editor: Editor | null;
  setComments: Dispatch<SetStateAction<MainComment[][]>>;
  comments: MainComment[][];
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

  const socket = useMemo(() => {
    if (process.env.BACKEND_URL === undefined) {
      // give an error
      console.log("BACKEND_URL is undefined");
      return io("", {
        transports: ["websocket"],
      });
    } else {
      return io(process.env.BACKEND_URL || "", {
        transports: ["websocket"],
      });
    }
  }, []);

  let newCommentText = "";
  const updateComments = useCallback(
    (data: string) => {
      // const comment: MainComment = {
      //   id: "ID:" + new Date().toISOString(),
      //   text: newCommentText + data,
      //   author: "AI",
      //   timestamp: new Date(),
      //   isStreaming: true,
      //   versionOfEssay: props.editor?.getText() || "",
      // };
      newCommentText += data;
      const comment = props.comments[props.comments.length - 1];
      if (!!comment) {
        const newComment = {
          ...comment,
          text: newCommentText,
          id: newCommentText,
        };
        const newCommentList = [...props.comments.slice(0, -1), newComment];
        console.log(newCommentList);
        props.setComments(newCommentList);
      }
      // if (!!comment) {
      //   comment.text = newCommentText;
      //   props.setComments(props.comments.concat);
      // }
    },
    [props],
  );

  useEffect(() => {
    socket.off("update_comments");
    socket.on("update_comments", updateComments);
  }, [updateComments]);

  const setComment = async () => {
    props.setIsLoading(true);

    try {
      // const selection = window.getSelection();
      // if (selection === null || selection.toString().trim() === "") {
      //   throw new Error("No text selected for comment.");
      // }

      // const textSelected = selection.toString();
      const selection = props.editor?.state.selection;
      let textSelected: string | undefined;
      if (selection) {
        const { from, to, empty } = selection;
        if (!empty) {
          textSelected =
            props.editor?.state.doc.textBetween(from, to, " ") || "";
        }
      }
      const commentId = "ID:" + new Date().toISOString();
      const commentText = "temp comment text";

      props.editor?.chain().focus().setComment(commentText, commentId).run();
      props.setComments((prev) => [
        [
          ...prev[0],
          {
            id: commentId,
            text: "",
            author: "AI",
            timestamp: new Date(),
            essaySectionReference: textSelected,
            versionOfEssay: props.editor?.getText() || "",
          },
        ],
        [
          ...prev[1],
          {
            id: commentId,
            text: "",
            author: "AI",
            timestamp: new Date(),
            essaySectionReference: textSelected,
            versionOfEssay: props.editor?.getText() || "",
          },
        ],
      ]);

      // const commentHistoryArray = [
      //   {
      //     role: "user",
      //     content: `Version of Essay: \`\`\`${comment.versionOfEssay}\`\`\`\nSection to Review: \`\`\`${comment.essaySectionReference}\`\`\``,
      //   },
      // ];
      let selectedTextObj = {};
      if (textSelected) {
        selectedTextObj = { section_to_review: textSelected };
      }
      const aiResponse = await axios({
        method: "post",
        url: "/backend/bot/feedback",
        timeout: 25000,
        data: {
          full_essay: props.editor?.getText(),
          prompt: props.prompt,
          ...selectedTextObj,
          stream: true,
        },
      });
      // console.log(aiResponse);
      // console.log(aiResponse);
      // if (!aiResponse.body) {
      //   throw new Error("AI Response body is undefined");
      // }
      // const reader = aiResponse.body.getReader();
      // console.log("READER", reader);
      // const decoder = new TextDecoder('utf-8');
      // let partial = '';
      // while (true) {
      //   console.log("BEFORE READ");
      //   const { done, value } = await reader.read();
      //   console.log("AFTER READ");
      //   if (done) {
      //     break
      //   }
      //   partial += decoder.decode(value);
      //   console.log("PARTIAL", partial);
      //   const lines = partial.split('\n');
      //   partial = lines.pop() || "";
      //   for (const line of lines) {
      //       comment.text = line;
      //       props.setComments([...props.comments, comment]);
      //   }
      // }
      // if (partial) {
      //   comment.text = partial;
      //   props.setComments([...props.comments, comment]);
      // }

      // props.setComments([...props.comments, comment]);
      props.setIsLoading(false);
    } catch (error) {
      props.setIsLoading(false);
      console.error("Error while setting a comment:", error);
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
