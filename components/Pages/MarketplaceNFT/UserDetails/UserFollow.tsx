import React, { useMemo, useState } from "react";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import ConnectWalletButton from "@/components/Button/ConnectWalletButton";
import MySpinner from "@/components/X721UIKits/Spinner";
import { useFollowUser } from "@/hooks/useMutate";

export interface Props {
  isFollowed?: boolean;
  userId: string;
  onRefresh: () => void;
}

export default function UserFollow({ isFollowed, userId, onRefresh }: Props) {
  const { isValidSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { trigger: followUserMutate } = useFollowUser();

  const isFollowing = useMemo(() => {
    if (!isValidSession) return false;
    return isFollowed;
  }, [isFollowed, isValidSession]);

  const handleFollow = async () => {
    try {
      setLoading(true);
      await followUserMutate({
        userId: userId,
      });
      onRefresh();
      toast.success(
        `${isFollowing ? "Unfollowed" : "Followed"} artist successfully`
      );
    } catch (e: any) {
      console.error(e);
      toast.error(`Failed to ${isFollowing ? "unfollow" : "follow"} artist`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConnectWalletButton action={(_) => handleFollow()}>
      <Button
        variant={isFollowing ? "secondary" : "primary"}
        scale="sm"
        className={`flex justify-center items-center transition-all`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {loading && <MySpinner size={18} />}
        {!isFollowing && <Icon name="plus" width={16} height={16} />}
        {isFollowing ? (isHovered ? "Unfollow" : "Following") : "Follow"}
      </Button>
    </ConnectWalletButton>
  );
}
