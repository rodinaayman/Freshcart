
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string; 
  role?: string;
  isActive?: boolean;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}