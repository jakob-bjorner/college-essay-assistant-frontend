import { Editor } from "@tiptap/react";
import axios from "axios";
import ThemeButtons from "@/components/ThemeButtons";

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
    props.editor
      ?.chain()
      .focus()
      .setComment("filler text for now", "xxx")
      .run();
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

  return (
    <div className="flex flex-row border-2 border-box p-2 md:p-4 m-2 rounded-lg bg-box space-x-4"> {/* Increased spacing */}
      <button onClick={undo} className="text-black rounded p-3 md:p-4 hover:bg-gray-200 text-2xl"> {/* Changed text color to black */}
        {String.fromCodePoint(0x238c)}
      </button>
      <button onClick={setBold} className="text-black rounded p-3 md:p-4 hover:bg-gray-200 text-2xl"> {/* Changed text color to black */}
        <b>B</b>
      </button>
      <button
        onClick={setStrikethrough}
        className="text-black rounded p-3 md:p-4 hover-bg-gray-200 text-2xl"> {/* Changed text color to black */}
        <s>S</s>
      </button>
      <button
        onClick={setItalic}
        className="text-black rounded p-3 md:p-4 hover:bg-gray-200 text-2xl"> {/* Changed text color to black */}
        <i>I</i>
      </button>
      <button
        onClick={setUnderline}
        className="text-black rounded p-3 md:p-4 hover:bg-gray-200 text-2xl"> {/* Changed text color to black */}
        <span className="underline">U</span>
      </button>
      <button
        onClick={setComment}
        className="text-black rounded p-3 md:p-4 hover:bg-gray-200 text-2xl"> {/* Changed text color to black */}
        {String.fromCodePoint(0x0001f5e8)}
      </button>
      <div className="rounded-md p-2 md:p-3 hover:bg-gray-700">
        <ThemeButtons />
      </div>
      
    </div>
  );
}