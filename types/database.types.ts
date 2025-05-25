export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface BusinessDetails {
  id: string;
  user_id: string;
  shop_name: string;
  created_at: string;
  updated_at: string;
}

export interface AuthError {
  message: string;
}