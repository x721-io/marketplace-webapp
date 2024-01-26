import React, { useState } from "react";
import Button from '@/components/Button'
import Icon from "@/components/Icon";
import { useMarketplaceApi } from "@/hooks/useMarketplaceApi";
import { toast } from "react-toastify";
import { Spinner } from "flowbite-react";

export interface Props {
  isFollowed?: boolean;
  userId: string
}

export default function UserFollow({ isFollowed, userId }: Props) {
  const api = useMarketplaceApi()
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(isFollowed);
  const [isHovered, setIsHovered] = useState(false);

  const handleFollow = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await api.followUser({
        userId: userId,
      });
      setIsFollowing(!isFollowing);
      toast.success(`User ${isFollowing ? "unfollowed" : "followed"} successfully`);
    } catch (e: any) {
      console.error(e);
      toast.error(`Failed to ${isFollowing ? "unfollow" : "follow"} user`);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div>
        <Button
            variant="secondary"
            scale="sm"
            className={`flex justify-center items-center ${isFollowing ? "bg-gray-300" : "secondary"}`}
            onClick={handleFollow}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
          {loading && <Spinner size="sm" />}
          {!isFollowing && <Icon name="plus" width={16} height={16} />}
          {isFollowing ? (isHovered ? "Unfollow" : "Following") : "Follow"}
        </Button>
      </div>
  );
}
