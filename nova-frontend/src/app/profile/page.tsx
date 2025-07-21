"use client";

import { useEffect, useState } from "react";
import UserProfile from "../../components/UserProfile";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, you would get the userId from your authentication context
    // This is just a placeholder implementation
    const checkAuth = async () => {
      try {
        // You would typically get this from your auth context
        // For now, we'll just use a mock user ID
        setUserId("mock-user-id");
      } catch (error) {
        console.error("Authentication error:", error);
        setError("Not authenticated");
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <UserProfile
          userId={userId}
          onUpdate={(user) => {
            console.log("User updated:", user);
            // Handle the update (e.g., show a success message)
          }}
        />
      </div>
    </div>
  );
}
