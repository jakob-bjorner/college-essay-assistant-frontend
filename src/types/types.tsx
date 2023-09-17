type IsMaintainingVersion = {
  versionOfEssay: string;
  essaySectionReference: string;
};

type MainComment = IsMaintainingVersion &
  CommentInterface & {
    id: string;
  };
type CommentInterface = {
  text: string;
  author: string;
  timestamp: Date;
  subComment?: CommentInterface;
};

type UserSubComment = CommentInterface & IsMaintainingVersion;

type AiSubComment = CommentInterface;

export type {
  MainComment,
  UserSubComment,
  AiSubComment,
  IsMaintainingVersion,
  CommentInterface,
};
