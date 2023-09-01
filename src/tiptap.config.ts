import Italic from "@tiptap/extension-italic";
import Document from "@tiptap/extension-document";
import HardBreak from "@tiptap/extension-hard-break";
import Bold from "@tiptap/extension-bold";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import BubbleMenu from "@tiptap/extension-bubble-menu";
import Paragraph from "@tiptap/extension-paragraph";
import History from "@tiptap/extension-history";
import Underline from "@tiptap/extension-underline";

import { Comment } from "./extensions/Comment";

import json from "./examplecontent";

const config = {
  extensions: [
    Italic,
    Document,
    HardBreak,
    Bold,
    Strike,
    Text,
    Comment,
    Paragraph,
    Underline,
    History.configure({
      depth: 10,
    }),
  ],
  editorProps: {
    attributes: {
      class: "focus:outline-none",
    },
  },
  content: json,
};

export default config;
