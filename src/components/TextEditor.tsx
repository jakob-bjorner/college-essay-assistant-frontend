"use client";

import { EditorContent, Editor } from "@tiptap/react";

const Tiptap = (props: { editor: Editor | null }) => {
  return <EditorContent editor={props.editor} />;
};

export default Tiptap;
