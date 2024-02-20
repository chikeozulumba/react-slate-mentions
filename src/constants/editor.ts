export enum SlateBlockTypes {
  Paragraph = "paragraph",
  Hashtag = "hashtag"
}

export const EDITOR_INITIAL_STATE = [
  {
    type: SlateBlockTypes.Paragraph,
    children: [
      {
        text: ``,
      },
    ],
  },
];
