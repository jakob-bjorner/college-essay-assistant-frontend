const json = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Example ",
        },
        {
          type: "text",
          marks: [
            {
              type: "comment",
              attrs: {
                comment: "gghhhh",
                commentId: "xxijiji",
              },
            },
          ],
          text: "Text",
        },
      ],
    },
  ],
};

export default json;
