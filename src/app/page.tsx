"use client";
import { Session } from "next-auth";
import { useEditor } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import { useEffect, useState } from "react";
import Link from "next/link";

import TipTap from "../components/TextEditor";
import Comment from "../components/SectionCommentReply";
import LogInBtn from "../components/LogInBtn";

import CustomBubbleMenu from "@/components/CustomBubbleMenu";

import config from "../tiptap.config";
import ExtendablePanels from "@/components/ExtendablePanels";
import ThemeButtons from "@/components/ThemeButtons";
import type { AppProps } from "next/app";
import SectionComment from "@/components/SectionComment";
// session will be passed into the pageProps: https://stackoverflow.com/questions/73668032/nextauth-type-error-property-session-does-not-exist-on-type
export default function Home() {
  const [comments, setComments] = useState<
    { selectedText: string; commentText: string }[]
  >([]);
  const onUpdate = ({ editor }: { editor: Editor }) => {
    const tempComments: { selectedText: string; commentText: string }[] = [];
    editor.state.doc.descendants((node, pos) => {
      const { marks } = node;
      marks.forEach((mark) => {
        if (mark.type.name == "comment") {
          const markComments = mark.attrs.comment;
          console.log(editor.getHTML());
          console.log(mark);
          tempComments.push({
            selectedText: "temp",
            commentText: markComments,
          });
        }
      });
    });
    setComments(Array.from(new Set(tempComments)));
  };
  const editor = useEditor({
    onUpdate: onUpdate,
    ...config,
  });

  useEffect(() => {
    if (editor) {
      onUpdate({ editor });
    }
  }, [editor]);
  return (
    <main>
      <div className="flex ml-16 mr-16 mt-4">
        {/* <LogInBtn></LogInBtn> */}

        <ExtendablePanels
          panel_one={
            <div className="dark:bg-gray-700 dark:text-gray-400 bg-gray-200 text-black p-2 m-2 rounded-md focus:outline-none max-h-[95vh] overflow-auto">
              <CustomBubbleMenu editor={editor} />
              <TipTap editor={editor} />
            </div>
          }
          panel_two={
            <div className="m-2 grid gap-2 h-fit w-full">
              {comments.map((comment, i) => (
                <SectionComment
                  selectedText={comment.selectedText}
                  fullEssay={editor?.getHTML() || ""}
                  commentText={comment.commentText}
                  key={i}
                ></SectionComment>
              ))}
            </div>
          }
          unique_panel_id={"panel_one"}
          panel_one_width={100}
        />
      </div>
      <ThemeButtons></ThemeButtons>
      {/* <Link href="/demo_backend">Go to demo backend</Link> */}
    </main>
  );
}
