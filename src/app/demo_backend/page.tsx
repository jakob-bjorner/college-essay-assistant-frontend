"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession, getSession } from "next-auth/react";

const MyComponent = () => {
  const { data: session, status } = useSession();

  const [dataRes, setDataRes] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchDataRes = async () => {
    try {
      const response = await axios.get("/backend/dataRes");
      setDataRes(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dataRes:", error);
    }
  };
  useEffect(() => {
    fetchDataRes();
  }, []);

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

//   // helo
//   return (
//     <div>
//       {data && (
//         <div>
//           <h2>Data from Backend:</h2>
//           <div>{!loading ? data : "Loading.."}</div>
//         </div>
//       )}
//     </div>
//   );
// };

export default MyComponent;
