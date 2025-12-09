export function checkRole(user: any, allowed: string[]) {
  if (!user) return false;
  return allowed.includes(user.role);
}
