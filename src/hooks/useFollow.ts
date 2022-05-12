import { useEffect, useState } from "react";
import { usePromiseFnWithToken } from "src/redux/asyncReducer";

export default function useFollow(initialIsFollowing, initialFollowingCount, url) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const followingOffset = initialIsFollowing == isFollowing ? 0 : !isFollowing ? -1 : 1;
    const followerCount = initialFollowingCount + followingOffset;
    const promiseFnWithToken = usePromiseFnWithToken();
    useEffect(() => {
        setIsFollowing(initialIsFollowing);
    }, [initialIsFollowing]);
    const handlePressFollowing = () => {
        setIsFollowing(!isFollowing);
        const method = isFollowing ? 'DELETE' : 'POST';
        promiseFnWithToken({url, method});
      };
    return [isFollowing, followerCount, handlePressFollowing];
};