"use client"; // Ensure it's a Client Component

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AccessDenied() {
  const router = useRouter();

  useEffect(() => {
    alert("Access Denied!");
    router.push("/"); // Redirect to home page
  }, []);

  return null; // No need to render anything
}
