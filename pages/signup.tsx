import React, { useState } from "react";
import axios from "axios";

function Signup() {
  const [grade, setGrade] = useState("");
  const [interestedColleges, setInterestedColleges] = useState("");
  const [name, setName] = useState("");

  const handleSignup = async () => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    };

    const response = await axios.post(
      "http://127.0.0.1:5000/user/create",
      {
        grade: grade,
        interested_colleges: interestedColleges,
        name: name,
        code: "DONK"
      },
      config
    );

    if (response.status === 200) {
      console.log("User created successfully.");

      // Check if response has an "_id" property
      if (response.data && response.data._id) {
        const userId = response.data._id;
        console.log("User ID:", userId);

        // Store user data in local storage
        localStorage.setItem('userData', JSON.stringify({ userId,grade, interestedColleges, name }));

        // Redirect to the dynamically generated profile route
        window.open('/');
      }

      setGrade("");
      setInterestedColleges("");
      setName("");
    } else {
      console.error("Error creating user:", response.data.error);
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





