"use client";

import React from "react";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import { redirect } from "next/navigation";

export default function page() {
  const { data: session } = useSession();
  if (session) {
    redirect("/");
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray">
      <div className="w-80 h-80 bg-white shadow-lg rounded-lg flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <button
            onClick={() => signIn("google")}
            className="bg-white px-2 py-2 mt-5 border w-full rounded-xl 
          flex justify-center items-center text-sm hover:scale-105 duration-300 text-[#002D74]"
          >
            <Image
              src="/img/google-logo.png"
              width={30}
              height={30}
              alt="Google Logo"
            />
            <span className="px-2">เข้าสู่ระบบด้วย Google</span>
          </button>
      </div>
    </div>
  );
}

