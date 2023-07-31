import { BubbleMenu, Editor } from "@tiptap/react";
import axios from "axios";
export default function CustomBubbleMenu(props: { editor: Editor | null }) {
  const setBold = () => {
    props.editor?.chain().focus().toggleBold().run();
  };
  const setItalic = () => props.editor?.chain().focus().toggleItalic().run();

  const setComment = () => {
    props.editor?.chain().focus().setComment("filler text for now").run();
    replaceComment("filler text for now");
  };
  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // create a function to call in set comment which takes in the temporary text put in the comment, and replaces it with the actual comment after getting text response from the backend.
  const replaceComment = async (comment: string) => {
    await sleep(100);
    // locate the selected text in the editor which is found by <span data-comment="filler text for now">
    const searchQuery = "span[data-comment='filler text for now']";
    const commentSpanElement = document.querySelector(searchQuery);
    const selectedText = commentSpanElement?.textContent;
    console.log(commentSpanElement);
    console.log(selectedText);
    commentSpanElement?.setAttribute("data-comment", "fulfilled comment");
    // retrieve comment from backend, for now just return dummy data
    console.log({
      data: {
        full_essay: props.editor?.getText(),
        section_to_review: selectedText,
      },
    });

    const commentResponse = async () => {
      if (selectedText && props.editor?.getText()) {
        return await axios({
          method: "post",
          url: "/backend/bot/feedback",
          data: {
            full_essay: props.editor?.getText(),
            section_to_review: selectedText,
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

    const xpath = "//div[text()='filler text for now']";
    const commentElement = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    ).singleNodeValue;
    // replace the filler text with the actual comment
    if (commentElement) {
      commentElement!.textContent = await commentResponse();
    } else {
      console.log("comment element ERROR", commentElement);
    }
  };

  const btnStyle = "border border-black rounded p-2";

  return (
    <>
      {props.editor ? (
        <BubbleMenu editor={props.editor} className="flex gap-1">
          <button onClick={setBold} className={btnStyle}>
            <strong>Bold</strong>
          </button>
          <button onClick={setItalic} className={btnStyle}>
            <em>Italic</em>
          </button>
          <button onClick={setComment} className={btnStyle}>
            {/* add highlight styling to the comment button text */}
            <span className="bg-yellow-200">Get Comment</span>
          </button>
        </BubbleMenu>
      ) : undefined}
    </>
  );
}
