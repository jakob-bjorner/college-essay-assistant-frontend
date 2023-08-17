"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

export default function LoggedInDemo() {
  const { data: session, status } = useSession();
  console.log(session);
  console.log(status);
  if (status === "authenticated") {
    return <p>Signed in</p>;
  }
  return (
    <div>
      <h1>Logged In Demo</h1>
      <p>This page is accessable to all. Please Log in.</p>
    </div>
  );
}
