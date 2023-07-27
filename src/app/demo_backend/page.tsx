"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const MyComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/backend/alldata");
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // helo
  return (
    <div>
      {data && (
        <div>
          <h2>Data from Backend:</h2>
          <div>
            {!loading ? (
              <pre>{JSON.stringify(data, null, 2)}</pre>
            ) : (
              "Loading.."
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyComponent;
