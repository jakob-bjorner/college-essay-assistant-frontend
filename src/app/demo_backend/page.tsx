"use client";

import { useEffect, useState } from "react";

export default function DemoBackend() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      fetch('/backend/alldata')
          .then(res => res.json())
          .then(data => {
              setMessage("User id from first user: " + data[0].user_id);
              setLoading(false);
          })
  }, []);
  return (
    <div>{!loading ? message : "Loading.."}</div>
  )
}
