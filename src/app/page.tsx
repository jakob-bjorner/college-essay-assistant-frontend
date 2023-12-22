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
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import PROMPTS from "@/prompts";

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
  const [isLoading, setIsLoading] = useState(false);
  const [totalAndCurrentComments, setTotalAndCurrentComments] = useState<
    MainComment[][]
  >([
    [
      {
        id: "xxijiji",
        text: "This is a sample comment.",
        author: "AI",
        timestamp: new Date(2001, 8, 27),
        essaySectionReference: "Text",
        versionOfEssay:
          "Prompt: What historical moment or event do you wish you could have witnessed? (50 words max)\n\nThe Trinity test, the first detonation of the atomic bomb. For one, an opportunity to meet my role models: Oppenheimer, Feynman, Fermi, etc. But also, to witness the 4 millisecond shift to an era of humanity that could eradicate itself. “Now I am become Death, the destroyer of worlds.” Text",
      },
    ],
    [
      {
        id: "xxijiji",
        text: "This is a sample comment.",
        author: "AI",
        timestamp: new Date(2001, 8, 27),
        essaySectionReference: "Text",
        versionOfEssay:
          "Prompt: What historical moment or event do you wish you could have witnessed? (50 words max)\n\nThe Trinity test, the first detonation of the atomic bomb. For one, an opportunity to meet my role models: Oppenheimer, Feynman, Fermi, etc. But also, to witness the 4 millisecond shift to an era of humanity that could eradicate itself. “Now I am become Death, the destroyer of worlds.” Text",
      },
    ],
  ]);

  const promptOptions = PROMPTS;

  const defaultPrompt = promptOptions[0];

  const [prompt, setPrompt] = useState(defaultPrompt.value);
  const [promptTitle, setPromptTitle] = useState(defaultPrompt.label);

  const handlePromptChange = (promptObject: any) => {
    setPromptTitle(promptObject.promptTitle);
    setPrompt(promptObject.value);
  };

  const handleCustomPrompt = (e: string) => {
    setPrompt(e);
    setPromptTitle("Custom");
  };

  // const onUpdate = useCallback(
  //   ({ editor }: { editor: Editor }) => {
  //     // take only the subset of comments which are still in the text editor to display to the user.
  //     let commentIdsFound: string[] = [];
  //     editor.state.doc.descendants((node, pos) => {
  //       const { marks } = node;
  //       marks.forEach((mark) => {
  //         if (mark.type.name == "comment") {
  //           commentIdsFound = [...commentIdsFound, mark.attrs.commentId];
  //         }
  //       });
  //     });
  //     // console.log(commentIdsFound);
  //     // console.log(comments);
  //     // console.log(editor.getJSON());
  //     setTotalAndCurrentComments((prev) => [
  //       prev[0],
  //       prev[0].filter((comment) => commentIdsFound.includes(comment.id)),
  //     ]);
  //   },
  //   [totalAndCurrentComments, setTotalAndCurrentComments],
  // );

  const editor = useEditor({
    ...config,
    editorProps: {
      attributes: {
        class:
          "dark:bg-gray-700 dark:text-gray-400 bg-white text-black w-full rounded-md",
      },
    },
    // onUpdate,
  });

  // console.log(editor?.getText());
  // useEffect(() => {
  //   if (editor) {
  //     onUpdate({ editor });
  //   }
  // }, [onUpdate]); // cant include essay dep. inf loop

  return (
    <main>
      <div className="cledge-text">cledge.</div>
      <Toolbar
        editor={editor}
        setComments={setTotalAndCurrentComments}
        comments={totalAndCurrentComments}
        prompt={prompt}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
      <div style={{ display: "flex" }}>
        <div style={{ width: "10rem" }}>
          <Dropdown
            options={promptOptions}
            onChange={(e) => handlePromptChange(e)}
            value={promptTitle}
            placeholder={"Select a prompt"}
          />
        </div>
        <textarea
          onChange={(e) => handleCustomPrompt(e.target.value)}
          style={{ color: "black", borderWidth: "2px", width: "100%" }}
          className="border"
          value={prompt}
        />
      </div>

      <div className="flex mt-4">
        {/* <LogInBtn></LogInBtn> */}
        <div className="mr-16 mt-4 w-full">
          <ExtendablePanels
            panel_one={
              <div className="gradient-box ml-16 overflow-auto">
                <TipTap editor={editor} />
              </div>
            }
            panel_two={
              <div className="m-2 grid gap-2 h-fit w-full">
                {(totalAndCurrentComments[1] || []).map((comment, i) => {
                  return (
                    <SectionComment
                      comment={comment}
                      editor={editor}
                      prompt={prompt}
                      key={i}
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                    ></SectionComment>
                  );
                })}
              </div>
            }
            unique_panel_id={"panel_one"}
            panel_one_width={200}
            panel_one_min_width={200}
            panel_two_min_width={200}
          />
        </div>
      </div>
      {/* <Link href="/demo_backend">Go to demo backend</Link> */}
    </main>
  );
}

function FilesTab() {
  return (
    <div>
      <div className="essays-boxes ml-4 mt-4">
        <div className="essays-rounded-box-pressed">UW Essays</div>
      </div>

      <div className="essays-boxes ml-4 mt-4">
        <div className="essays-rounded-box-not-pressed">Stanford Essays</div>
      </div>

      <div className="essays-boxes ml-4 mt-4">
        <div className="essays-rounded-box-not-pressed">
          Georgia Tech Essays
        </div>
      </div>

      <div className="essays-boxes ml-4 mt-4">
        <div className="essays-rounded-box-not-pressed">Stanford Essays</div>
      </div>
      <div className="essays-boxes ml-4 mt-4">
        <div className="essays-rounded-box-not-pressed">UC Essays</div>
      </div>

      <div className="essays-boxes ml-4 mt-4">
        <div className="essays-rounded-box-not-pressed">MIT Essays</div>
      </div>

      <div className="essays-boxes ml-4 mt-4">
        <div className="essays-rounded-box-not-pressed">Harvard Essays</div>
      </div>

      <div className="essays-boxes ml-4 mt-4">
        <div className="essays-rounded-box-not-pressed">
          Northeastern Essays
        </div>
      </div>
    </div>
  );
}
