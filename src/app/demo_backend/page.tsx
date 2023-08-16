"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession, getSession } from "next-auth/react";
import jwt from "jsonwebtoken"; // Import jsonwebtoken library

const MyComponent = () => {
  const { data: session, status } = useSession();
  const [dataRes, setDataRes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); // State variable to store user ID

  const fetchDataRes = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/user/retrieve/${userIdentifier}`);
      setDataRes(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dataRes:", error);
    }
  };

  useEffect(() => {
    fetchDataRes();

    if (status === "authenticated" && session?.id_token) {
      try {
        const decodedToken = jwt.decode(session.id_token); // Decode JWT token
        if (decodedToken && decodedToken.sub) {
          setUserId(decodedToken.sub); // Set the user ID from the JWT token
        }
        const response = axios.post("http://127.0.0.1:5000/user/retrieve_user",
        {
          jwtToken: decodedToken.sub
        });

        const userIdentifier = response.data._id;
        userIdentifier.toString();
        const data = axios.get(`http://127.0.0.1:5000/user/retrieve/${userIdentifier}`);
        const userData = response.data;
        setUserProfileData(userData);
      }
      catch (error) {
        console.error("Error decoding JWT token:", error);
      }
    }
  }, [status, session]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  return (
    <>
      <h1>Protected Page</h1>
      <p>You can view this page because you are signed in.</p>
      <>
        <h4>{status}</h4>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </>
      {userId && <p>User ID from JWT: {userId}</p>} {/* Display user ID */}
      <div>
        {dataRes && (
          <div>
            <h2>Data from Backend:</h2>
            <div>{!loading ? dataRes : "Loading.."}</div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyComponent;
