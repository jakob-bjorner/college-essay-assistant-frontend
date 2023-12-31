/*
  Modified from https://github.com/sereneinserenade/tiptap-comment-extension
*/
import { getMarkRange, Mark, mergeAttributes } from "@tiptap/react";
import { Plugin, TextSelection } from "prosemirror-state";

export interface CommentOptions {
  HTMLAttributes: Record<string, any>;
  isCommentModeOn: () => boolean;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    comment: {
      /**
       * Set a comment mark
       */
      setComment: (comment: string, commentId: string) => ReturnType;
      /**
       * Toggle a comment mark
       */
      toggleComment: () => ReturnType;
      /**
       * Unset a comment mark
       */
      unsetComment: () => ReturnType;
    };
  }
}

export const Comment = Mark.create<CommentOptions>({
  name: "comment",

  addOptions() {
    return {
      HTMLAttributes: {},
      isCommentModeOn: () => false,
    };
  },

  addAttributes() {
    return {
      comment: {
        default: null,
        parseHTML: (el) => (el as HTMLSpanElement).getAttribute("data-comment"),
        renderHTML: (attrs) => ({
          "data-comment": attrs.comment,
          style: "background-color: #ff0",
        }),
      },
      commentId: {
        default: null,
        parseHTML: (el) => (el as HTMLSpanElement).getAttribute("data-comment"),
        renderHTML: (attrs) => ({
          id: `comment-${attrs.commentId}`,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-comment]",
        getAttrs: (el) =>
          !!(el as HTMLSpanElement).getAttribute("data-comment")?.trim() &&
          null,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addCommands() {
    return {
      setComment:
        (comment: string, commentId: string) =>
        ({ commands }) =>
          commands.setMark("comment", { comment, commentId }),
      toggleComment:
        () =>
        ({ commands }) =>
          commands.toggleMark("comment"),
      unsetComment:
        () =>
        ({ commands }) =>
          commands.unsetMark("comment"),
    };
  },

  addProseMirrorPlugins() {
    const extensionThis = this;

    const plugins = [
      new Plugin({
        props: {
          handleClick(view, pos) {
            if (!extensionThis.options.isCommentModeOn()) return false;

            const { schema, doc, tr } = view.state;

            const range = getMarkRange(doc.resolve(pos), schema.marks.comment);

            if (!range) return false;

            const [$start, $end] = [
              doc.resolve(range.from),
              doc.resolve(range.to),
            ];

            view.dispatch(tr.setSelection(new TextSelection($start, $end)));

            return true;
          },
        },
      }),
    ];

    return plugins;
  },
});
