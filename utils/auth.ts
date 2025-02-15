export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const login = async (credentials: {
  email: string;
  password: string;
  role: string;
}) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
};

export const signup = async (userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const response = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return response.json();
};
