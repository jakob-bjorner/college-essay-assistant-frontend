import React, { useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import { useSession, getSession } from "next-auth/react";
import jwt from "jsonwebtoken";

function Signup() {
  const [grade, setGrade] = useState("");
  const [interestedColleges, setInterestedColleges] = useState("");
  const [name, setName] = useState("");

  const handleSignup = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };

      let USERID;  // Declare the variable outside the block

      if (typeof window !== "undefined") {
        USERID = sessionStorage.getItem("userID");  // Assign a value inside the block
      }
        const sanitizedGrade = DOMPurify.sanitize(grade);
        const sanitizedInterestedColleges = DOMPurify.sanitize(interestedColleges);
        const sanitizedName = DOMPurify.sanitize(name);

        const response = await axios.post(
          "http://127.0.0.1:5000/user/create",
          {
            grade: sanitizedGrade,
            interested_colleges: sanitizedInterestedColleges,
            name: sanitizedName,
            code: "DONK",
            sub: USERID,
          },
          config
        );

      if (response.status === 200) {
        console.log("User created successfully.");
        setGrade("");
        setInterestedColleges("");
        setName("");
        window.location.href = '/';
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="signup-content">
      <h2>Sign Up</h2>
      <input
        type="text"
        placeholder="Grade"
        value={grade}
        onChange={(e) => setGrade(e.target.value)}
      />
      <input
        type="text"
        placeholder="Interested Colleges"
        value={interestedColleges}
        onChange={(e) => setInterestedColleges(e.target.value)}
      />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}

export default Signup;
