"use client";

import { Bell, UserCircle } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900 px-6">

      <div>
        <h1 className="text-xl font-bold text-white">
          Warehouse Management System
        </h1>

        <p className="text-sm text-slate-400">
          Jordans Lighting India Pvt. Ltd.
        </p>
      </div>

      <div className="flex items-center gap-5">

        <button className="relative">
          <Bell className="text-white" size={22} />

          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        <div className="flex items-center gap-2">

          <UserCircle size={32} className="text-white" />

          <div>
            <p className="text-sm font-semibold text-white">
              Swapnil
            </p>

            <p className="text-xs text-slate-400">
              Warehouse Admin
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}