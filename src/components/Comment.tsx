import { PropsWithChildren } from "react";

const Comment = (props: PropsWithChildren) => {
  return (
    <div className="dark:bg-gray-700 dark:text-gray-400 bg-gray-200 text-black p-2 rounded-md w-full">
      {props.children}
    </div>
  );
};

export default Comment;
