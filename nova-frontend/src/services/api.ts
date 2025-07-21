import {
  ApiResponse,
  User,
  CountryCodesResponse,
  UserResponse,
  FavoritesResponse,
  PocketsResponse,
  LoginResponse,
  BalanceResponse,
  MovementsResponse,
} from "../types/api";

class ApiClient {
  private baseUrl: string;
  private currentUserId: string | null = null;
  private currentUsername: string | null = null;
  private currentUserEmail: string | null = null;

  constructor(
    baseUrl: string = process.env.NEXT_PUBLIC_API_URL || "https://nova.dmirandam.com"
  ) {
    this.baseUrl = baseUrl;
  }

  setUserId(userId: string | null) {
    this.currentUserId = userId;
    console.log("el userId recibido es", userId)
  }
  
  setUserEmail(email: string | null) {
    this.currentUserEmail = email;
    console.log("el email recibido es", email);
  }

  setUsername(username: string | null) {
    this.currentUsername = username;
    console.log("el username recibido es", username)
  }


  private validateUserId(userId: string | null | undefined): string {
    console.log('Validating user ID:', { userId, currentUserId: this.currentUserId });
    if (!userId) {
      console.error('User ID validation failed:', { userId, currentUserId: this.currentUserId });
      throw new Error("User ID is required for this operation");
    }
    return userId;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    console.log('Making API request:', { 
      endpoint, 
      currentUserId: this.currentUserId,
      headers: options.headers 
    });

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: response.statusText }));
      console.error('API request failed:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(
        errorData.error || `API request failed: ${response.statusText}`
      );
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(): Promise<void> {
    await this.request("/api/logout", {
      method: "POST",
    });
  }

  // User endpoints
  async getCountryCodes(): Promise<CountryCodesResponse> {
    return this.request<CountryCodesResponse>("/api/country-codes");
  }

  async createUser(user: Omit<User, "id">): Promise<UserResponse> {
    return this.request<UserResponse>("/api/users", {
      method: "POST",
      body: JSON.stringify(user),
    });
  }

  async getUser(userId?: string): Promise<UserResponse> {
    console.log('getUser called with:', { userId, currentUserId: this.currentUserId });
    const validUserId = this.validateUserId(userId || this.currentUserId);
    return this.request<UserResponse>(`/api/users/${validUserId}`);
  }

  async updateUser(userId: string | undefined, user: Partial<User>): Promise<ApiResponse> {
    const validUserId = this.validateUserId(userId || this.currentUserId);
    return this.request<ApiResponse>(`/api/users/${validUserId}`, {
      method: "PUT",
      body: JSON.stringify(user),
    });
  }

  async deleteUser(userId?: string): Promise<ApiResponse> {
    const validUserId = this.validateUserId(userId || this.currentUserId);
    return this.request<ApiResponse>(`/api/users/${validUserId}`, {
      method: "DELETE",
    });
  }

  async getUserByName(username: string): Promise<any> {
    return this.request<any>(`/api/users/name/${username}`);
  }

  // Favorites endpoints
  async getFavorites(userId?: string): Promise<FavoritesResponse> {
    const validUserId = this.validateUserId(userId || this.currentUserId);
    return this.request<FavoritesResponse>(`/api/users/${validUserId}/favorites`);
  }

  async addFavorite(
    favoriteUserId: string,
    alias: string,
    userId?: string
  ): Promise<ApiResponse> {
    const validUserId = this.validateUserId(userId || this.currentUserId);
    return this.request<ApiResponse>(`/api/users/${validUserId}/favorites`, {
      method: "POST",
      body: JSON.stringify({ favorite_user_id: favoriteUserId, alias }),
    });
  }

  async updateFavorite(
    favoriteId: string,
    alias: string,
    userId?: string
  ): Promise<ApiResponse> {
    const validUserId = this.validateUserId(userId || this.currentUserId);
    return this.request<ApiResponse>(
      `/api/users/${validUserId}/favorites/${favoriteId}`,
      {
        method: "PUT",
        body: JSON.stringify({ alias }),
      }
    );
  }

  async deleteFavorite(
    favoriteId: string,
    userId?: string
  ): Promise<ApiResponse> {
    const validUserId = this.validateUserId(userId || this.currentUserId);
    return this.request<ApiResponse>(
      `/api/users/${validUserId}/favorites/${favoriteId}`,
      {
        method: "DELETE",
      }
    );
  }

  // Pockets endpoints
  async getPockets(userId?: string): Promise<PocketsResponse> {
    const validUserId = this.validateUserId(userId || this.currentUserId);
    return this.request<PocketsResponse>(`/api/users/${validUserId}/pockets`);
  }

  async createPocket(
    name: string,
    category: string,
    maxAmount: number,
    userId?: string
  ): Promise<ApiResponse> {
    const validUserId = this.validateUserId(userId || this.currentUserId);
    return this.request<ApiResponse>(`/api/users/${validUserId}/pockets`, {
      method: "POST",
      body: JSON.stringify({
        user_id: validUserId,
        username: this.currentUsername,
        name,
        category,
        max_amount: maxAmount
      }),
    });
  }

  async updatePocket(
    pocketId: string,
    name: string,
    category: string,
    maxAmount: number,
    userId?: string
  ): Promise<ApiResponse> {
    const validUserId = this.validateUserId(userId || this.currentUserId);
    return this.request<ApiResponse>(`/api/users/${validUserId}/pockets/${pocketId}`, {
      method: "PUT",
      body: JSON.stringify({
        user_id: validUserId,
        name,
        category,
        max_amount: maxAmount
      }),
    });
  }

  async deletePocket(pocketId: string, userId?: string): Promise<ApiResponse> {
    const validUserId = this.validateUserId(userId || this.currentUserId);
    return this.request<ApiResponse>(`/api/users/${validUserId}/pockets/${pocketId}`, {
      method: "DELETE",
    });
  }

  // Transaction endpoints
  async createAccount(
    username: string,
    isBank: boolean,
    userId?: string
  ): Promise<ApiResponse> {
    const validUserId = this.validateUserId(userId || this.currentUserId);
    return this.request<ApiResponse>("/api/account", {
      method: "POST",
      body: JSON.stringify({ user_id: validUserId, username, bank: isBank }),
    });
  }

  async createTransfer(
    toUser: string,
    amount: number,
    fromUser?: string,
    
  ): Promise<ApiResponse> {
    const validFromUser = this.validateUserId(fromUser || this.currentUserId);
    const validToUser = this.validateUserId(toUser);
    const email = this.currentUserEmail;
    return this.request<ApiResponse>("/api/transfers", {
      method: "POST",
      body: JSON.stringify({ from_user: validFromUser, to_user: validToUser, amount, email }),
    });
  }

  async getBalance(
    fromTime: number,
    toTime: number,
    userId?: string
  ): Promise<BalanceResponse> {
    const validUserId = this.validateUserId(userId || this.currentUserId);
    const params = new URLSearchParams({
      user_id: validUserId,
      from_time: fromTime.toString(),
      to_time: toTime.toString(),
    });
    return this.request<BalanceResponse>(`/api/balance?${params.toString()}`);
  }

  async addMoney(
    amount: number,
    to_user?: string
  ): Promise<ApiResponse> {
    const from_user = "00000000-0000-0000-0000-000000000001";
    const validToUser = this.validateUserId(to_user || this.currentUserId);
    const email = this.currentUserEmail;
    if (!email) {
      throw new Error("Current user email is required for this operation");
    }
    return this.request<ApiResponse>("/api/transfers", {
      method: "POST",
      body: JSON.stringify({
        amount,
        from_user,
        to_user: validToUser,
        email
      })
    });
  }
  
  async reduceMoney(
    amount: number
  ): Promise<ApiResponse> {
    const to_user = "00000000-0000-0000-0000-000000000001";
    const from_user = this.validateUserId(this.currentUserId);
    const email = this.currentUserEmail;
    if (!email) {
      throw new Error("Current user email is required for this operation");
    }
    return this.request<ApiResponse>("/api/transfers", {
      method: "POST",
      body: JSON.stringify({
        amount,
        from_user,
        to_user,
        email
      })
    });
  }

  async getMovements(
    fromTime: number,
    toTime: number,
    limit: boolean,
    userId?: string
  ): Promise<MovementsResponse> {
    const validUserId = this.validateUserId(userId || this.currentUserId);
    const params = new URLSearchParams({
      id: validUserId,
      from: fromTime.toString(),
      to: toTime.toString(),
      lim: limit.toString(),
    });
    return this.request<MovementsResponse>(`/api/movements?${params.toString()}`);
  }

}

// Create a singleton instance
const apiClient = new ApiClient();
export default apiClient;
