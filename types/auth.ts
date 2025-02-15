export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "agent" | "admin";
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}
