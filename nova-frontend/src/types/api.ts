// User Types
export interface User {
  user_id?: string;
  email: string;
  username: string;
  phone: string;
  first_name: string;
  last_name: string;
  birthdate: string;
}

export interface CountryCode {
  id: string;
  name: string;
  code: string;
}

export interface Favorite {
  id: string;
  favorite_user_id: string;
  alias: string;
}

export interface Pocket {
  id: string;
  name: string;
  category: string;
  max_amount: number;
}

// Transaction Types
export interface Account {
  username: string;
  bank: boolean;
  user_id: string;
}

export interface Transfer {
  from_user: string;
  to_user: string;
  amount: number;
}

export interface Balance {
  balance: number;
  currency: string;
}

export interface Movement {
  id: string;
  from_user: string;
  to_user: string;
  amount: number;
  timestamp: number;
}

// API Response Types
export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface LoginResponse extends ApiResponse {
  email: string;
  data?: string; // JWT token from backend
}

export interface CountryCodesResponse extends ApiResponse {
  country_codes: CountryCode[];
  codes: CountryCode[];
}

export interface UserResponse extends User, ApiResponse {}

export interface FavoritesResponse extends ApiResponse {
  favorites: Favorite[];
}

export interface PocketsResponse extends ApiResponse {
  pockets: Pocket[];
}

export interface BalanceResponse extends Balance, ApiResponse {}

export interface MovementsResponse extends ApiResponse {
  movements: Movement[];
}

// Error Response
export interface ErrorResponse {
  error: string;
}
