import { Editor } from "@tiptap/react";

import axios from "axios";

export default function Toolbar(props: { editor: Editor | null }) {
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
    props.editor?.chain().focus().setComment("filler text for now").run();
    replaceComment("filler text for now");
  };

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

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
          props.editor?.getText()
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
      null
    ).singleNodeValue;
    // replace the filler text with the actual comment
    if (commentElement) {
      commentElement!.textContent = await commentResponse();
    } else {
      console.log("comment element ERROR", commentElement);
    }
  };

  return (
    <div className="border-2 border-box p-4 m-2 rounded-lg bg-box w-[1375px]">
      <button onClick={undo} className="rounded ml-2 p-2 hover:bg-gray-200">
        {String.fromCodePoint(0x238c)}
      </button>
      <button onClick={setBold} className="rounded ml-2 p-2 hover:bg-gray-200">
        <b>B</b>
      </button>
      <button
        onClick={setStrikethrough}
        className="rounded ml-2 p-2 hover:bg-gray-200"
      >
        <s>S</s>
      </button>
      <button
        onClick={setItalic}
        className="rounded ml-2 p-2 hover:bg-gray-200"
      >
        <i>I</i>
      </button>
      <button
        onClick={setUnderline}
        className="rounded ml-2 p-2 hover:bg-gray-200"
      >
        <span className="underline">U</span>
      </button>
      <button
        onClick={setComment}
        className="rounded ml-2 p-2 hover:bg-gray-200"
      >
        {String.fromCodePoint(0x0001f5e8)}
      </button>
    </div>
  );
}
