"use client";
import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import Comment from "../components/Comment";
import { useEditor } from "@tiptap/react";
import config from "../tiptap.config";
import TipTap from "../components/TextEditor";
import CustomBubbleMenu from "@/components/CustomBubbleMenu";
import LogInBtn from "../components/LogInBtn";

export default function Home() {
  const [userProfileData, setUserProfileData] = useState(null);
  const [comments, setComments] = useState<string[]>([]);
  const [UserId, setUserId] = useState(null);
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
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/user/retrieve/${UserId}`
        );
        const userData = response.data; // Assuming the response contains user profile data
        setUserProfileData(userData);
      } catch (error) {
        console.error("Error fetching user profile data:", error);
      }
    };

    const fetchUserFromToken = async () => {
      try {
        console.log("Fetch token started");
        const response = await axios.post(
          "http://127.0.0.1:5000/user/retrieve_user",
          {
            jwtToken: {
              tkn: answer,
            },
          },
          {
            headers: {
              //               "Content-Type": "application/json", // Set the correct Content-Type header
              token: exportedToken,
            },
          }
        );

        // Log the sent JWT token
        console.log("Sent JWT token:", exportedToken);
        if (response.data.user !== null) {
          setUserId(JSON.stringify(response.data.user));
        } else {
          window.open("/signup", "_blank"); // Open signup page in a new tab
        }
      } catch (error) {
        console.error("Error fetching user data from JWT:", error);
      }
    };

    fetchUserFromToken();
    fetchData();
  }, [UserId]);

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
