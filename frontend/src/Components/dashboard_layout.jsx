function DashboardLayout({title}){
    return (
        <div className="flex min-h-screen">
            <div className="w-64 bg-teal-500 text-white p-4">
                <h2 className="text-xl font-bold">{title}</h2>
            </div>
            <div className="flex-1 p-6">
                <h1 className=" text-2xl font-bold text-teal-500">
                  {title} DashBoard
                </h1>
            </div>
        </div>
    );
}
export default DashboardLayout;
 
