import { mergeAttributes } from "@tiptap/react";
import { Paragraph } from "@tiptap/extension-paragraph";

const ParagraphID = Paragraph.extend({
  renderHTML({ HTMLAttributes }) {
    this.storage.count++;
    return [
      "p",
      mergeAttributes(HTMLAttributes, {
        id: `p-${this.storage.count}`,
      }),
      0,
    ];
  },
  priority: 200,
  addStorage() {
    return {
      count: 0,
    };
  },
});

export default ParagraphID;
