const json = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: `Prompt: What historical moment or event do you wish you could have witnessed? (50 words max)`,
        },
      ],
    },
    {
      type: "paragraph",
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: `The Trinity test, the first detonation of the atomic bomb.`,
        },
        {
          type: "text",
          marks: [
            {
              type: "comment",
              attrs: {
                comment:
                  'Example comment text on the text: "For one, an opportunity to meet", this section is well writen but if ever more content needs to be added, "For one" can be omitted',
                commentId: "xxijiji",
              },
            },
          ],
          text: " For one, an opportunity to meet",
        },
        {
          type: "text",
          text: ` my role models: Oppenheimer, Feynman, Fermi, etc. But also, to witness the 4 millisecond shift to an era of humanity that could eradicate itself. “Now I am become Death, the destroyer of worlds.” `,
        },
      ],
    },
  ],
};

export default json;
