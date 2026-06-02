import { useAuth } from "../context/AuthContext";
import { User } from "lucide-react";

function AccountStatus() {
  const { user } = useAuth();

  if (!user) return null;

  const displayName = user.full_name || user.name || "User";
  const displayRole = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User";

  return (
    <div className="flex items-center gap-3 rounded-lg border border-teal-100 bg-white px-4 py-2 shadow-sm">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#129a95] text-white">
        <User size={18} />
      </div>
      <div className="flex flex-col">
        <p className="text-sm font-semibold text-gray-800">{displayName}</p>
        <p className="text-xs text-gray-600">{displayRole}</p>
      </div>
    </div>
  );
}

export default AccountStatus;
