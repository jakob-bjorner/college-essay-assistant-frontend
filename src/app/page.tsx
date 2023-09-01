"use client";

import { Session } from "next-auth";
import { useEditor } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import { useEffect, useState } from "react";
import Link from "next/link";

import TipTap from "../components/TextEditor";
import Comment from "../components/SectionCommentReply";
import LogInBtn from "../components/LogInBtn";

import config from "../tiptap.config";
import ExtendablePanels from "@/components/ExtendablePanels";
import ThemeButtons from "@/components/ThemeButtons";
import type { AppProps } from "next/app";
import SectionComment from "@/components/SectionComment";
import Toolbar from "@/components/Toolbar";
// session will be passed into the pageProps: https://stackoverflow.com/questions/73668032/nextauth-type-error-property-session-does-not-exist-on-type

export default function Home() {
  const [comments, setComments] = useState<
    { selectedText: string; commentText: string }[]
  >([]);
  const onUpdate = ({ editor }: { editor: Editor }) => {
    const tempComments: { selectedText: string; commentText: string }[] = [];
    // search through child elements of the posemirror text editor and look for 
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
      <div>
        <div className="cledge-text">cledge.</div>

        <Toolbar editor={editor} />

        <div className="flex mt-4">
          {/* <LogInBtn></LogInBtn> */}
          <div>
            <div className="essays-boxes ml-4 mt-4">
              <div className="essays-rounded-box-pressed">UW Essays</div>
            </div>

            <div className="essays-boxes ml-4 mt-4">
              <div className="essays-rounded-box-not-pressed">
                Stanford Essays
              </div>
            </div>

            <div className="essays-boxes ml-4 mt-4">
              <div className="essays-rounded-box-not-pressed">
                Georgia Tech Essays
              </div>
            </div>

            <div className="essays-boxes ml-4 mt-4">
              <div className="essays-rounded-box-not-pressed">
                Stanford Essays
              </div>
            </div>
            <div className="essays-boxes ml-4 mt-4">
              <div className="essays-rounded-box-not-pressed">UC Essays</div>
            </div>

            <div className="essays-boxes ml-4 mt-4">
              <div className="essays-rounded-box-not-pressed">MIT Essays</div>
            </div>

            <div className="essays-boxes ml-4 mt-4">
              <div className="essays-rounded-box-not-pressed">
                Harvard Essays
              </div>
            </div>

            <div className="essays-boxes ml-4 mt-4">
              <div className="essays-rounded-box-not-pressed">
                Northeastern Essays
              </div>
            </div>
          </div>

          <div className="mr-16 mt-4 w-full">
            <ExtendablePanels
              panel_one={
                <div className="gradient-box ml-16">
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
              panel_one_width={200}
              panel_one_min_width={200}
              panel_two_min_width={200}
            />
          </div>
        </div>
      </div>

      <ThemeButtons></ThemeButtons>
      {/* <Link href="/demo_backend">Go to demo backend</Link> */}
    </main>
  );
}
