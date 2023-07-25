import Italic from "@tiptap/extension-italic";
import Document from "@tiptap/extension-document";
import HardBreak from "@tiptap/extension-hard-break";
import Bold from "@tiptap/extension-bold";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";

import ParagraphID from "./extensions/ParagraphID";
import { Comment } from "./extensions/Comment";

const config = {
  extensions: [
    Italic,
    ParagraphID,
    Document,
    HardBreak,
    Bold,
    Strike,
    Text,
    Comment,
  ],
  editorProps: {
    attributes: {
      class: "focus:outline-none",
    },
  },
  content: "Hello",
};

export default config;
