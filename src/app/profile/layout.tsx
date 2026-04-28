"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaMapMarkerAlt, FaCog, FaUser } from "react-icons/fa";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: "/profile/addresses", label: "My Addresses", icon: FaMapMarkerAlt },
    { href: "/profile/settings", label: "Settings", icon: FaCog },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-gradient-to-br from-green-600 via-green-500 to-green-400 text-white">
        <div className=" mx-auto px-4 py-10 sm:py-12">
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
            <Link href="/" className="hover:text-white transition-colors duration-200">Home</Link>
            <span className="text-white/40">/</span>
            <span className="text-white font-medium">My Account</span>
          </nav>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl ring-1 ring-white/30">
              <FaUser className="text-3xl" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Account</h1>
              <p className="text-white/80 mt-1">Manage your addresses and account settings</p>
            </div>
          </div>
        </div>
      </div>

      <div className=" mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          <aside className="w-full lg:w-72 shrink-0">
            <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">My Account</h2>
              </div>
              <ul className="p-2">
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                          ${isActive 
                            ? "bg-green-50 text-green-700" 
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors
                          ${isActive ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"}
                        `}>
                          <link.icon className="text-sm" />
                        </div>
                        <span className="font-medium flex-1">{link.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}