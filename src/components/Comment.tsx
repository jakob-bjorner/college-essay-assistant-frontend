import { PropsWithChildren, ReactNode, ReactPropTypes } from "react";
import { JsxElement } from "typescript";

const Comment = (props: PropsWithChildren) => {
  return (
    <div className={"bg-white p-2 rounded-lg text-black"}>{props.children}</div>
  );
};

export default Comment;
