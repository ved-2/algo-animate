import SideBar from "@/app/sections/dash/SideBar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#f3f6f4]">
      {/* Sidebar */}
      <div className="w-[250px] bg-white shadow-md">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 mt-15 overflow-auto">{children}</div>
    </div>
  );
}
