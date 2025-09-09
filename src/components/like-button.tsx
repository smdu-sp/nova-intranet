"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";

interface LikeButtonProps {
  postId: number;
  isAuthenticated: boolean;
  showCommentIcon?: boolean;
  onCommentClick?: () => void;
}

interface LikeData {
  totalLikes: number;
  userLiked: boolean;
}

export default function LikeButton({
  postId,
  isAuthenticated,
  showCommentIcon = false,
  onCommentClick,
}: LikeButtonProps) {
  const [likeData, setLikeData] = useState<LikeData>({
    totalLikes: 0,
    userLiked: false,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLikeData();
  }, [postId]);

  const fetchLikeData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${postId}/likes`);

      if (response.ok) {
        const data = await response.json();
        setLikeData(data);
      }
    } catch (err) {
      console.error("Erro ao carregar dados de like:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated || submitting) {
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(`/api/posts/${postId}/likes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLikeData({
          totalLikes: data.totalLikes,
          userLiked: data.userLiked,
        });
      }
    } catch (err) {
      console.error("Erro ao gerenciar like:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
        {showCommentIcon && (
          <div className="animate-pulse bg-gray-200 h-8 w-8 rounded"></div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        size="sm"
        onClick={handleLike}
        disabled={!isAuthenticated || submitting}
        className={`flex items-center gap-2 transition-all duration-200 ${
          likeData.userLiked
            ? "text-red-600 border-red-300 bg-red-50 hover:bg-red-100"
            : "text-gray-600 border-gray-300 hover:bg-gray-50"
        } ${!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <Heart
          className={`h-4 w-4 ${likeData.userLiked ? "fill-current" : ""} ${
            submitting ? "animate-pulse" : ""
          }`}
        />
        <span className="text-sm font-medium">
          {likeData.totalLikes > 0 ? likeData.totalLikes : "Curtir"}
        </span>
      </Button>

      {showCommentIcon && onCommentClick && (
        <Button
          variant="outline"
          size="sm"
          onClick={onCommentClick}
          className="flex items-center gap-2 text-gray-600 border-gray-300 hover:bg-gray-50"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Comentar</span>
        </Button>
      )}
    </div>
  );
}
