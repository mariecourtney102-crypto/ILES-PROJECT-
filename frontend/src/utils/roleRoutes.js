export const ROLE_ROUTES = {
  admin: "/admin",
  supervisor: "/supervisor",
  student: "/student",
};

export function getRoleRoute(role) {
  return ROLE_ROUTES[role] || "/login";
}
