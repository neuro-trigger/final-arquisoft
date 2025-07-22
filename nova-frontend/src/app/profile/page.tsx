"use client";

import { useEffect, useState } from "react";
import UserProfile from "../../components/UserProfile";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return; // wait until auth state resolved

    if (!isAuthenticated || !user?.userID) {
        setError("Not authenticated");
      router.replace("/login");
      return;
      }

    setUserId(user.userID);
  }, [loading, isAuthenticated, user, router]);

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
