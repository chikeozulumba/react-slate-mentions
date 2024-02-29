export enum SlateBlockTypes {
  Paragraph = "paragraph",
  Hashtag = "hashtag",
  Mention = "mention"
}

export const editorPrefixes = {
  "@": SlateBlockTypes.Mention,
  "#": SlateBlockTypes.Hashtag,
} as Record<string, SlateBlockTypes>

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
