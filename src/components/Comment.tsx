import { PropsWithChildren, useState } from "react";
import { Button } from "reactstrap";

const Comment = (props: PropsWithChildren) => {
  const [userResponse, setUserResponse] = useState("");
  const [isInputVisible, setInputVisible] = useState(true);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setUserResponse(event.target.value);
      setInputVisible(false);
    }
  };

  return (
    <div className="text-gray-200 p-2">
      <div className="comment-first">{props.children}</div>
      {isInputVisible ? (
        <div className="comment-last">
          <input
            type="text"
            id="message"
            name="message"
            placeholder="Reply..."
            onKeyDown={handleKeyDown}
          />
        </div>
      ) : (
        <div>
          <div className="comment-default">{userResponse}</div>
          <div className="comment-last">Response Loading...</div>
        </div>
      )}
    </div>
  );
};

export default Comment;
