export const getRole = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("role");
};

export const isAdmin = () => getRole() === "admin";
export const isUser = () => getRole() === "user";
