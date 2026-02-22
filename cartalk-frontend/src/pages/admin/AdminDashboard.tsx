// 10. 관리자 페이지

import { useState } from "react";
import {
  Users, FileText, AlertOctagon, Settings,
  Search, Filter, Edit, Trash2, Ban,
  ChevronRight, BarChart3, LayoutDashboard, LogOut
} from "lucide-react";

// --- Mock Data ---
const MOCK_USERS = [
  { id: 1, name: "An (Developer)", email: "an@cartalk.pro", role: "Admin", status: "Active", joined: "2026-02-01" },
  { id: 2, name: "Kim Car", email: "kim@test.com", role: "User", status: "Active", joined: "2026-02-15" },
  { id: 3, name: "Bad Driver", email: "report@spam.com", role: "User", status: "Banned", joined: "2026-02-18" },
];

const MOCK_STATS = [
  { label: "Total Users", value: "1,240", icon: <Users className="h-5 w-5" />, color: "bg-blue-50 text-blue-600" },
  { label: "Daily Posts", value: "48", icon: <FileText className="h-5 w-5" />, color: "bg-emerald-50 text-emerald-600" },
  { label: "Recall Alerts Sent", value: "312", icon: <AlertOctagon className="h-5 w-5" />, color: "bg-rose-50 text-rose-600" },
  { label: "System Uptime", value: "99.9%", icon: <BarChart3 className="h-5 w-5" />, color: "bg-amber-50 text-amber-600" },
];

export default function AdminDashboard() {
  const [selectedMenu, setSelectedMenu] = useState("Users");

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* 1. Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <span className="font-black text-lg tracking-tight">Admin CP</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { name: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
            { name: "Users", icon: <Users className="h-4 w-4" /> },
            { name: "Posts", icon: <FileText className="h-4 w-4" /> },
            { name: "Recalls", icon: <AlertOctagon className="h-4 w-4" /> },
          ].map((menu) => (
            <button
              key={menu.name}
              onClick={() => setSelectedMenu(menu.name)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                selectedMenu === menu.name
                ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                {menu.icon} {menu.name}
              </div>
              <ChevronRight className={`h-3 w-3 ${selectedMenu === menu.name ? "opacity-100" : "opacity-0"}`} />
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* 2. Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold">{selectedMenu} Management</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-slate-200 transition-all w-64"
              />
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300" />
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Dashboard Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_STATS.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${stat.color}`}>{stat.icon}</div>
                  <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">+12%</span>
                </div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-black mt-1 text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* User CRUD Table Section */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold">User List</h2>
              <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">
                + Add New User
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    {["User", "Role", "Status", "Joined Date", "Actions"].map((head) => (
                      <th key={head} className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_USERS.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{user.name}</span>
                          <span className="text-xs text-slate-500">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${user.role === 'Admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex items-center gap-1.5">
                          <div className={`h-1.5 w-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {user.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">{user.joined}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 shadow-sm transition-all"><Edit className="h-4 w-4" /></button>
                          <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 shadow-sm transition-all"><Ban className="h-4 w-4" /></button>
                          <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 shadow-sm transition-all"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center text-xs text-slate-400 font-medium">
              Showing {MOCK_USERS.length} users &middot; Page 1 of 1
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}