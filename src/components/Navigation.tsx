"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/i/register", label: "Register" },
  { href: "/i/login", label: "Login" },
  { href: "/i/session", label: "Session Info" },
  { href: "/i/profile", label: "Profile" },
  { href: "/i/users", label: "Users" },
  { href: "/i/customers", label: "Customers" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2.5 mb-5">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`px-6 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
            pathname === link.href
              ? "bg-white text-[#667eea]"
              : "bg-white/20 text-white hover:bg-white hover:text-[#667eea]"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
