"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface AdminLogoutProps {
  user?: {
    username: string;
    displayName: string;
  };
}

export function AdminLogout({ user }: AdminLogoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/admin/login");
        router.refresh();
      } else {
        console.error("Erro no logout");
      }
    } catch (error) {
      console.error("Erro no logout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {user && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">{user.displayName}</span>
          <span className="text-gray-400 ml-2">({user.username})</span>
        </div>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        disabled={isLoading}
      >
        {isLoading ? "Saindo..." : "Sair"}
      </Button>
    </div>
  );
}
