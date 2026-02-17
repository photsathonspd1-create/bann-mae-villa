"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Home, ImageIcon, Settings, FileText, Users, Menu, X, Megaphone } from "lucide-react";
import { AdminSignOut } from "@/app/admin/AdminSignOut";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Manage Villas", href: "/admin/villas", icon: Home },
  { label: "Hero Slides", href: "/admin/hero", icon: ImageIcon },
  { label: "Campaigns", href: "/admin/campaigns", icon: Megaphone },
  { label: "Articles", href: "/admin/articles", icon: FileText },
  { label: "Leads", href: "/admin/leads", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 text-yellow-500 hover:bg-neutral-800 transition-colors"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 flex-shrink-0 flex-col border-r border-neutral-800 bg-neutral-900 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="border-b border-neutral-800 p-6">
          <Link
            href="/"
            className="text-xl font-semibold tracking-wide text-yellow-500"
          >
            BAAN MAE
          </Link>
          <p className="mt-1 text-xs text-neutral-500">Admin</p>
        </div>
        
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)} // Close mobile menu on navigation
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="border-t border-neutral-800 p-4">
          <AdminSignOut />
        </div>
      </aside>
    </>
  );
}
