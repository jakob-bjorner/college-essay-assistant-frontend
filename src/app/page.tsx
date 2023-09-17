"use client";

// import { Session } from "next-auth";
import { useEditor } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

import TipTap from "../components/TextEditor";
// import Comment from "../components/SectionCommentReply";
// import LogInBtn from "../../to be moved back to src app/LogInBtn";

import config from "../tiptap.config";
import ExtendablePanels from "@/components/ExtendablePanels";
import ThemeButtons from "@/components/ThemeButtons";
import type { AppProps } from "next/app";
import SectionComment from "@/components/SectionComment";
import Toolbar from "@/components/Toolbar";
import { MainComment } from "@/types/types";
// session will be passed into the pageProps: https://stackoverflow.com/questions/73668032/nextauth-type-error-property-session-does-not-exist-on-type

export default function Home() {
  /* Plan for maintaining comments:
   * 1. Maintain a dictionary mapping from comment id to comment and corresponding subcomment data.
   *  - each comment and sub comment has the associated json:
   *   - comment id (string)
   *   - comment text (string)
   *   - comment author (string)
   *   - comment timestamp (date)
   *   - comment essay section refence (string)
   *   - comment version of the essay comment was made on (string)
   *   - comment subcomment (subcomment)
   *  - each subcomment has the associated json:
   *   - subcomment text (string)
   *   - subcomment author (string)
   *   - subcomment timestamp (date)
   *   - subcomment version of the essay comment was made on (string)
   *   - subcomment subcomment (subcomment)
   */
  // const [comments, setComments] = useState<MainComment[]>([]);
  // below for testing purposes
  const [comments, setComments] = useState<MainComment[]>([
    {
      id: "xxijiji",
      text: "This is a sample comment.",
      author: "AI",
      timestamp: new Date(2001, 8, 27),
      essaySectionReference: "Text",
      versionOfEssay:
        "Prompt: What historical moment or event do you wish you could have witnessed? (50 words max)\n\nThe Trinity test, the first detonation of the atomic bomb. For one, an opportunity to meet my role models: Oppenheimer, Feynman, Fermi, etc. But also, to witness the 4 millisecond shift to an era of humanity that could eradicate itself. “Now I am become Death, the destroyer of worlds.” Text",
    },
  ]);

  // const onUpdate = ({ editor }: { editor: Editor }) => {
  // const tempComments: Comment[] = [];
  // editor.state.doc.descendants((node, pos) => {
  //   const { marks } = node;
  //   console.log(node);
  //   marks.forEach((mark) => {
  //     if (mark.type.name == "comment") {
  //       const markComments = mark.attrs.comment;
  //       console.log(editor.getHTML());
  //       console.log(mark);
  //       tempComments.push({
  //         essaySectionReference: "temp",
  //         commentText: markComments,
  //       });
  //     }
  //   });
  // });
  // setComments(Array.from(new Set(tempComments)));
  // };
  const editor = useEditor({
    ...config,
    editorProps: {
      attributes: {
        class:
          "dark:bg-gray-700 dark:text-gray-400 bg-gray-200 text-black w-full rounded-md",
      },
    },
    // onUpdate: onUpdate,
  });
  // console.log(editor?.getText());
  // useEffect(() => {
  //   if (editor) {
  //     onUpdate({ editor });
  //   }
  // }, [editor]);

  return (
    <main>
      <div>
        <div className="cledge-text">cledge.</div>
        <Toolbar
          editor={editor}
          setComments={setComments}
          comments={comments}
        />

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
                      comment={comment}
                      editor={editor}
                      key={i}
                    ></SectionComment>
                  ))}
                  {/* {JSON.stringify(comments)} */}
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
