"use client";
import { useEditor } from "@tiptap/react";
import Link from "next/link";

import TipTap from "../components/TextEditor";
import Comment from "../components/Comment";
import LogInBtn from "../components/LogInBtn";

import config from "../tiptap.config";

export default function Home(
  { session, ...pageProps }: { session: any },
) {
  const editor = useEditor(config);
  
  
  return (
    <div>
      <div className="flex ml-16 mr-16 mt-4">
        <LogInBtn></LogInBtn>
        <div className="bg-white rounded-lg m-2 p-2 w-5/6 text-black focus:outline-none max-h-[95vh] overflow-auto">
          <TipTap editor={editor} />
        </div>
        <div className="w-1/6 m-2 grid gap-2">
          <Comment>Hi there</Comment>
        </div>
      </div>
      <Link href="/demo_backend">
        Go to demo backend
      </Link>
    </div>
  );
}
