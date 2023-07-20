import { PropsWithChildren, ReactNode, ReactPropTypes } from "react";
import { JsxElement } from "typescript";

const Comment = (props: PropsWithChildren) => {
  const className =
    "bg-white p-2 rounded-lg " +
    (() => {
      if (props.children) return "text-black";
      return "text-white";
    })();

  return (
    <div className={className}>{props.children ? props.children : "Hi"}</div>
  );
};

export default Comment;
