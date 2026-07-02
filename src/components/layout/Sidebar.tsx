"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ArrowDownCircle,
  ArrowUpCircle,
  History,
  BarChart3,
} from "lucide-react";

const menu = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/products",
    icon: Package,
  },
  {
    name: "Goods Receipt",
    href: "/goods-receipt",
    icon: ArrowDownCircle,
  },
  {
    name: "Stock Out",
    href: "/stock-out",
    icon: ArrowUpCircle,
  },
  {
    name: "Warehouses",
    href: "/warehouses",
    icon: Warehouse,
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: History,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-white min-h-screen">

      <div className="p-6 text-2xl font-bold">
        Jordans WMS 🚀
      </div>

      <nav className="px-3 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-800 transition"
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}