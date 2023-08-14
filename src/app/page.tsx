"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Comment from "../components/Comment";
import { useEditor } from "@tiptap/react";
import config from "../tiptap.config";
import TipTap from "../components/TextEditor";
import CustomBubbleMenu from "@/components/CustomBubbleMenu";
import LogInBtn from "../components/LogInBtn";
import { useSession, getSession } from "next-auth/react";
import jwt from "jsonwebtoken";

export default function Home() {
  const [userProfileData, setUserProfileData] = useState(null);
  const [comments, setComments] = useState<string[]>([]);
  const [UserId, setUserId] = useState(null);
  const { data: session, status } = useSession();

  const editor = useEditor({
    onUpdate({ editor }) {
      const tempComments: string[] = [];
      editor.state.doc.descendants((node, pos) => {
        const { marks } = node;
        marks.forEach((mark) => {
          if (mark.type.name === "comment") {
            const markComments = mark.attrs.comment;
            tempComments.push(markComments);
          }
        });
      });
      setComments(tempComments);
    },
    ...config,
  });

  useEffect(() => {
    if (status === "authenticated" && session?.id_token) {
      try {
        const decodedToken = jwt.decode(session.id_token);
        if (decodedToken && decodedToken.sub) {
          setUserId(decodedToken.sub);
          localStorage.setItem('userID', decodedToken.sub);
        }
      } catch (error) {
        console.error("Error decoding JWT token:", error);
      }
    }
  }, [status, session]);

  useEffect(() => {
    fetchData();
  }, [UserId]);

      const fetchData = async () => {
      try {
        const response = await axios.post("http://127.0.0.1:5000/user/retrieve_user", {
          jwtToken: decodedToken.sub
        });

        const userIdentifier = response.data._id;
        userIdentifier.toString();
        const userDataResponse = await axios.get(`http://127.0.0.1:5000/user/retrieve/${userIdentifier}`);
        const userData = userDataResponse.data;
        setUserProfileData(userData);

      } catch (error) {
        console.error("Error fetching user profile data:", error);
        //window.location.href = '/signup';
      }
    };


  return (
    <main>
      <div className="flex ml-16 mr-16 mt-4">
        <LogInBtn />
        <div className="bg-white rounded-lg m-2 p-2 w-5/6 text-black focus:outline-none max-h-[95vh] overflow-auto">
          <CustomBubbleMenu editor={editor} />
          <TipTap editor={editor} />
        </div>
        <div className="w-1/6 m-2 grid gap-2">
          {comments.map((comment, i) => (
            <Comment key={i}>{comment}</Comment>
          ))}
        </div>
        {userProfileData && (
          <div>
            <h3>User Profile:</h3>
            <p>Name: {userProfileData.name}</p>
            <p>Grade: {userProfileData.grade}</p>
            <p>Interested Colleges: {userProfileData.interested_colleges}</p>
          </div>
        )}
      </div>
    </main>
  );
}
