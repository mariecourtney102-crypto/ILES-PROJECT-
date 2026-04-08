import Sidebar from "./Sidebar";

function DashboardLayout({ title, children }) {
  return (
    <div className="flex min-h-screen">

      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-teal-500 mb-4">
          {title}
        </h1>

        {children}
      </div>

    </div>
  );
}

export default DashboardLayout;
