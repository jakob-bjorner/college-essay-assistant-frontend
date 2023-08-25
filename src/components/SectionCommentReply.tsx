import axios from "axios";
import React, {
  KeyboardEventHandler,
  PropsWithChildren,
  useCallback,
} from "react";

const SectionCommentReply = ({
  aiText,
  fullEssay,
  selectedText,
  getPriorComments = () => [],
}: {
  aiText: string;
  fullEssay: string;
  selectedText: string;
  getPriorComments?: () => { role: string; content: string }[];
}) => {
  const [userResponse, setUserResponse] = React.useState<string>(
    "hello there what is up with that medical insurance company policy? Isnt insurance a perfectly competitive market? Like why in the world would they not have lower prices? Unless you actually pay people more in medicine."
  );
  const [aiResponseString, setAiResponseString] = React.useState<string>("");

  const newGetPriorComments = useCallback(() => {
    const allComments = getPriorComments();
    allComments.push({ role: "asssistant", content: aiText });
    allComments.push({ role: "user", content: userResponse });
    return allComments;
  }, [getPriorComments, aiText, userResponse]);

  const commentResponse = async () => {
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
  };

  const handleUserResponse: React.KeyboardEventHandler<HTMLTextAreaElement> =
    useCallback(
      (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // when enter is pressed convert the textarea to an uneditable div with the text
        if (event.key === "Enter") {
          event.preventDefault();
          const allComments = newGetPriorComments();
          setAiResponseString(JSON.stringify(allComments));
          event.currentTarget.disabled = true;
        }
      },
      [newGetPriorComments, setAiResponseString]
    );

  return (
    <>
      <div className="comment bot-comment dark:bg-gray-700 dark:text-gray-400 bg-gray-200 text-black p-2 rounded-md w-full">
        {aiText}
      </div>
      <div className="comment user-comment dark:bg-gray-700 dark:text-gray-400 bg-gray-200 text-black p-2 rounded-md w-full">
        <textarea
          onKeyDown={handleUserResponse}
          className="outline-none resize-none h-min text-black w-full content-fit"
          onChange={(e) => setUserResponse(e.target.value)}
          value={userResponse}
        ></textarea>
      </div>
      {aiResponseString && (
        <SectionCommentReply
          getPriorComments={newGetPriorComments}
          aiText={aiResponseString}
        ></SectionCommentReply>
      )}
    </>
  );
};

export default SectionCommentReply;
