import { PropsWithChildren } from "react";

const Comment = (props: PropsWithChildren) => {
  return (
    <div className="bg-white p-2 rounded-lg text-black">{props.children}</div>
  );
};

export default Comment;
