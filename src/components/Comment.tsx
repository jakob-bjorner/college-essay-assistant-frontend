import { PropsWithChildren, useState } from "react";
import { Button } from "reactstrap";

const Comment = (props: PropsWithChildren) => {
  const [userResponse, setUserResponse] = useState('');
  const [isInputVisible, setInputVisible] = useState(true);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setUserResponse(event.target.value);
      setInputVisible(false);
    }
  };
  
  
  return (
    <div className="text-gray-200 p-2">
      <div className="dark:bg-gray-700 dark:text-gray-400 bg-white text-black p-2 rounded-md w-full">
        {props.children}
      </div>
      {isInputVisible ? (
        <div className="dark:bg-gray-700 dark:text-gray-400 bg-white text-black p-2 rounded-md w-full">
          <input
            type="text"
            id="message"
            name="message"
            onKeyDown={handleKeyDown}
          />
        </div>
      ) : (
        <div>
          <div className="dark:bg-gray-700 dark:text-gray-400 bg-white text-black p-2 rounded-md w-full">
            {userResponse}
          </div>
          <div className="dark:bg-gray-700 dark:text-gray-400 bg-white text-black p-2 rounded-md w-full">
            Response Loading...
          </div>
        </div>
      )}
    </div>
  );
};

export default Comment;
