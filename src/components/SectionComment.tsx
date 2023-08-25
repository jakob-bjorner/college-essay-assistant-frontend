import SectionCommentReply from "./SectionCommentReply";
export default function SectionComment({
  commentText,
  fullEssay,
  selectedText,
}: {
  commentText: string;
  fullEssay: string;
  selectedText: string;
}) {
  return (
    <div className="dark:bg-gray-800 bg-gray-100 text-black p-2 rounded-md grid gap-2 w-full">
      <SectionCommentReply
        fullEssay={fullEssay}
        selectedText={selectedText}
        aiText={commentText}
      ></SectionCommentReply>
    </div>
  );
}
