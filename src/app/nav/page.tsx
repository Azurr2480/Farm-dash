"use client"; // Ensures this is a Client Component

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi"; // Ensure you have react-icons installed

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession(); // Get authentication status
  const [hydrated, setHydrated] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
  ];

  if (!hydrated) return null;

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">IoT-Based Vertical Hydroponics System </h1>


        {/* Hamburger Button for Mobile */}
        <div className="md:hidden ml-auto">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && session?.user && (
        <div className="md:hidden mt-2 border-t pt-2 space-y-2">
          <div className="flex items-center gap-2">
            <img
              src={session.user.image ?? "/default-avatar.png"}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border"
            />
            <span className="text-gray-700">{session.user.name}</span>
          </div>
          <button
            onClick={() => signOut()}
            className="w-full bg-danger text-white px-4 py-2 rounded-md"
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}
