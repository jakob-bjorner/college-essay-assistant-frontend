import {
  MainComment,
  UserSubComment,
  AiSubComment,
  CommentInterface,
  IsMaintainingVersion,
} from "@/types/types";
import { Editor } from "@tiptap/react";
import axios from "axios";
import React, { useCallback, useState } from "react";

const SectionCommentReply = ({
  commentHistory,
  subComment,
  editor,
  prompt,
  isLoading,
  setIsLoading,
}: {
  commentHistory: MainComment;
  subComment: CommentInterface | undefined;
  editor: Editor | null;
  prompt: string;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [messageText, setMessageText] = React.useState<string>(
    subComment?.text || "",
  );
  if (
    subComment !== undefined &&
    subComment?.subComment === undefined &&
    subComment.author === "AI"
  ) {
    subComment.subComment = {
      text: "Please give me a better comment. Give an example of a successful essay!",
      author: "User",
      timestamp: new Date(),
    };
  }

  const [showSimilarEssay, setShowSimilarEssay] = React.useState(false);
  const [similarEssay, setSimilarEssay] = React.useState("");

  const toggleSimilarEssay = () => {
    setShowSimilarEssay(!showSimilarEssay);

    if (!showSimilarEssay && similarEssay === "") {
      loadSimilarEssay();
    }
  };

  const loadSimilarEssay = async () => {
    if (editor) {
      setIsLoading(true);
      try {
        const similarEssayResponse = await axios({
          method: "post",
          url: "/backend/essay/retrieve-similar",
          data: {
            full_essay: editor.getText(),
          },
        });

        if (
          similarEssayResponse.data.profiles &&
          similarEssayResponse.data.profiles.length > 0
        ) {
          const desiredDatatype = "full essay";
          for (const profile of similarEssayResponse.data.profiles) {
            if (profile[desiredDatatype]) {
              const similarEssayText = JSON.parse(
                `"${profile[desiredDatatype]}"`,
              );
              setSimilarEssay(similarEssayText);
              break;
            }
          }
        }
      } catch (error) {
        console.error("Error loading similar essays:", error);
      }
      setIsLoading(false);
    }
  };

  const [subSubComment, setSubSubComment] =
    React.useState<CommentInterface | null>(subComment?.subComment || null);

  const handleUserResponse: React.KeyboardEventHandler<HTMLTextAreaElement> =
    useCallback(
      async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        setIsLoading(true);
        // when enter is pressed convert the textarea to an uneditable div with the text
        if (event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.disabled = true;
          event.currentTarget.style.minHeight = "fit-content";
          event.currentTarget.className =
            "comment user-comment dark:bg-gray-700 dark:text-gray-400 bg-gray-200 text-black p-2 rounded-md w-full";
          if (subComment === undefined || subComment === null) {
            throw new Error("subcomment is null or undefined");
          }
          if (editor === null) {
            throw new Error("editor is null");
          }
          // find all spans with the id comment-XXX, and put all their text into a single string
          let sectionToReviewString = "";
          const spans = document.querySelectorAll(
            `span[id^='comment-${commentHistory.id}']`,
          );
          spans.forEach((span) => {
            sectionToReviewString += span.textContent;
          });
          // console.log(sectionToReviewString);

          // update the subcomment for the user, so the comment History array that is created
          // naturally contains the question the user just asked.
          (subComment as UserSubComment).essaySectionReference =
            sectionToReviewString;
          (subComment as UserSubComment).versionOfEssay = editor?.getText();
          // constuct a comment History to be fed into AI.
          let commentCurr: CommentInterface | undefined = commentHistory;
          const commentHistoryArray = [
            {
              role: "user",
              content:
                "Version of Essay: " +
                "```" +
                (commentCurr as MainComment).versionOfEssay +
                "```" +
                "\nSection to Review: " +
                "```" +
                (commentCurr as MainComment).essaySectionReference +
                "```",
            },
          ];

          while (commentCurr !== undefined) {
            let commentSummary = {
              role: commentCurr.author === "AI" ? "assistant" : "user",
              content: "",
            };
            if (commentCurr.author === "AI") {
              commentSummary.content = commentCurr.text;
            } else {
              const userComment = commentCurr as UserSubComment;
              commentSummary.content +=
                "Version of Essay: " +
                "```" +
                userComment.versionOfEssay +
                "```";
              commentSummary.content +=
                "\nSection to Review: " +
                "```" +
                userComment.essaySectionReference +
                "```";
              commentSummary.content +=
                "\nMessage: " + "```" + userComment.text + "```";
            }
            commentHistoryArray.push(commentSummary);
            commentCurr = commentCurr.subComment;
          }

          const aiResponse = await axios({
            method: "post",
            url: "/backend/bot/comment-reply",
            timeout: 25000,
            data: {
              full_essay: editor?.getText(),
              section_to_review: sectionToReviewString,
              comment_history: commentHistoryArray,
              prompt: prompt,
            },
          }).then((response) => {
            return response.data;
          });

          // const aiResponse = "Test feedback string";
          console.log(commentHistoryArray);

          // create AI subcomment for display on retrieval (TODO: indicate wait on frontend or stream the text!)
          subComment.subComment = {
            text: aiResponse,
            author: "AI",
            timestamp: new Date(),
          };
          setSubSubComment(subComment.subComment);
          setIsLoading(false);
        }
      },
      [editor, subComment, commentHistory, prompt, setIsLoading],
    );
  if (subComment === null || subComment === undefined) {
    return <></>;
  }

  return (
    <>
      {subComment?.author === "AI" ? (
        <div>
          <div className="comment bot-comment dark:bg-gray-700 dark:text-gray-400 bg-gray-200 text-black p-2 rounded-md w-full">
            {messageText}
          </div>
          <button onClick={toggleSimilarEssay}>
            {showSimilarEssay ? (
              <span className="text-2l">▼</span>
            ) : (
              <span className="text-2l">▶</span>
            )}
            See accepted essay example
          </button>
          {showSimilarEssay && similarEssay !== "" && (
            <div>
              <pre style={{ whiteSpace: "pre-wrap" }}>{similarEssay}</pre>
            </div>
          )}
        </div>
      ) : (
        <div className="comment user-comment dark:bg-gray-700 dark:text-gray-400 bg-gray-200 text-black p-2 rounded-md w-full">
          <textarea
            className="outline-none resize-none h-min text-black w-full content-fit"
            // rows={1}
            style={{
              resize: "none",
              height: "auto",
              // maxHeight: "130px",
              overflowWrap: "break-word",
              // width: "55vw",
              minHeight: "90px",
              outline: "none",
              border: "1px solid #B2B0C4",
              borderRadius: "6px",
              padding: "6px",
            }}
            onKeyDown={handleUserResponse}
            value={messageText}
            onChange={(e) => {
              subComment.text = e.target.value;
              setMessageText(e.target.value);
            }}
          />
        </div>
      )}
      {subSubComment && (
        <SectionCommentReply
          commentHistory={commentHistory}
          subComment={subSubComment}
          editor={editor}
          prompt={prompt}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        ></SectionCommentReply>
      )}
    </>
  );
};

export default SectionCommentReply;
