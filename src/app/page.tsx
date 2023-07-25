"use client";
import { useEditor } from "@tiptap/react";

import TipTap from "../components/TextEditor";
import Comment from "../components/Comment";

import config from "../tiptap.config";

export default function Home() {
  const editor = useEditor(config);

  return (
    <main className="flex ml-16 mr-16 mt-4">
      <div className="bg-white rounded-lg m-2 p-2 w-5/6 text-black focus:outline-none max-h-[95vh] overflow-auto">
        <TipTap editor={editor} />
      </div>
      <div className="w-1/6 m-2">
        <Comment>Hi there</Comment>
      </div>
    </main>
  );
}
