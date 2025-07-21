import { User, UserResponse, ApiResponse } from "../types/api";

const mockUser: User = {
  user_id: "mock-user-id",
  email: "john.doe@example.com",
  username: "johndoe",
  phone: "+1 (555) 123-4567",
  first_name: "John",
  last_name: "Doe",
  birthdate: "1990-01-15"
};

class MockApiClient {
  async getUser(userId: string): Promise<UserResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: "User fetched successfully",
      ...mockUser
    };
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<ApiResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: "User updated successfully"
    };
  }
}

const mockApiClient = new MockApiClient();
export default mockApiClient; 