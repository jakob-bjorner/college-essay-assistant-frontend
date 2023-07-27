"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function DemoBackend() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  //a base to work off of to get and post things to the backend
  useEffect(() => {
      const headers = {'Access-Control-Allow-Origin': '*'};
      axios.get('http://127.0.0.1:5000/api/data',{
      headers: {'Access-Control-Allow-Origin': '*' }
      }).then(res => {
              setMessage("User id from first user: " + res.data.message);
              setLoading(false);
          })
        .catch(error => {
          // Handle any errors that occurred during the API request
          console.error('Error:', error.message);
      });
  }, []);
  return (//
    <div>{!loading ? message : "Loading.."}</div>
  )
}
