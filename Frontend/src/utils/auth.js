export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

export const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const payload = token.split(".")[1];
  const decoded = JSON.parse(atob(payload));
  return decoded.role;
};
